import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EventBus from 'eventing-bus';
import ReactTable from 'react-table-6';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import { Device } from '@twilio/voice-sdk';
import { Editor } from 'react-draft-wysiwyg';
import { withRouter } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import CallIcon from '@material-ui/icons/Call';
import { green } from '@material-ui/core/colors';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { EditorState, convertToRaw } from 'draft-js';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Row, Card, CardHeader, CardBody, CardTitle, Button } from "reactstrap";

import Timer from '../../components/Timer';
import Dialpad from '../../components/Dialpad';
import { setCount, setStart, getTwilioToken, getCallingTask, setCallDone, callTaskCompleted } from '../../store/actions/Integration';

import "./index.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

let device;
const Integrations = () => {

    // Store
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const { twilioToken, callTasks } = useSelector(state => state['Integration']);

    // State for selected Task and OnGoing Call
    const [task, setTask] = useState({});
    const [mute, setMute] = useState(false);
    const [call, setCall] = useState({ phone: '', status: '' });

    // Controls for NotePad and DailPad
    const [isActive, setActive] = useState("false");
    const [isEditorActive, setEditorActive] = useState("false");

    const [Outcome, setOutcome] = useState('');
    const [CallRating, setCallRating] = useState(0);
    const [isTextShow, setIsTextShow] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        dispatch(getCallingTask());
        dispatch(getTwilioToken());
    }, []);
    useEffect(() => device = new Device(twilioToken), [twilioToken]);
    useEffect(() => { if (call['status'] == 'Connected') call['object'].mute(mute) }, [mute]);
    // useEffect(() => console.log('***** callTasks = ', callTasks), [callTasks]); // Remove this

    // Task Module
    const moveTask = (type) => {
        if (call['status']) return EventBus.publish('error', `Please complete the call first`);

        let taskIndex = callTasks.findIndex(({ taskId }) => taskId === task['taskId']);
        if (type == 'Next') {
            if (taskIndex < callTasks.length - 1) setTask(callTasks[taskIndex + 1]);
            else setTask(callTasks[0]);
        } else if (type == 'Back') {
            if (taskIndex == 0) setTask(callTasks[callTasks.length - 1]);
            else setTask(callTasks[taskIndex - 1]);
        }
    };

    // Calling Module
    const connectCall = async (contact, type, index) => {
        try {
            let taskCopy = JSON.parse(JSON.stringify(task));
            taskCopy['contacts'][index]['status'] = 'Connected';
            setTask(taskCopy);

            // TODO: Validate Phone Number
            let callObj = await device.connect({
                params: {
                    To: contact[type],
                    phone: contact[type],
                    dealId: contact['dealId'],
                    taskId: contact['taskId'],
                    contactId: contact['hs_object_id']
                }
            });

            callEvents(callObj);
            dispatch(setCount(0));
            dispatch(setStart(true));
            setCall({ index, phone: contact[type], type, contact, object: callObj, CallSid: JSON.stringify(callObj['parameters']['CallSid']), status: 'Connected' });
        } catch (e) { console.log('ERROR connectCall: ', e) }
    };

    const callEvents = (call) => {
        call.on('reject', () => disconnetCall());
        call.on('cancel', () => disconnetCall());
        call.on('disconnect', () => disconnetCall());
        call.on('accept', accept => console.log('********** accept = ', JSON.stringify(accept['parameters']['CallSid'])));
        call.on('mute', (isMuted, call) => {
            isMuted ? console.log('***** muted ', mute) : console.log('********unmuted ', mute);
        });

        call.on('volume', function (inputVolume, outputVolume) {
            const micVolumeElement = document.getElementById('input-volume');
            const speakerVolumeElement = document.getElementById('output-volume');

            let inputColor = 'red';
            if (inputVolume < 0.5) inputColor = 'green';
            else if (inputVolume < 0.75) inputColor = 'yellow';
            if (micVolumeElement) micVolumeElement.style.width = `${Math.floor(inputVolume * 300)}px`;
            if (micVolumeElement) micVolumeElement.style.background = inputColor;

            let outputColor = 'red';
            if (outputVolume < 0.5) outputColor = 'green';
            else if (outputVolume < 0.75) outputColor = 'yellow';
            if (speakerVolumeElement) speakerVolumeElement.style.width = `${Math.floor(outputVolume * 300)}px`;
            if (speakerVolumeElement) speakerVolumeElement.style.background = outputColor;
        });
    };

    const disconnetCall = () => {
        if (call['status'] != 'Connected') return;

        if (task?.['contacts']?.[call['index']]) {
            let taskCopy = JSON.parse(JSON.stringify(task));
            taskCopy['contacts'][call['index']]['status'] = 'Disconnected';
            setTask(taskCopy);
        }
        device.disconnectAll();
        dispatch(setStart(false));
        setCall({ ...call, status: 'Disconnected' });
    };

    const submitCall = async () => {
        if (!Outcome) return EventBus.publish('error', `Please select outcome`);

        let text, links = [], images = [], embeddedLinks = [];
        let editorData = await convertToRaw(editorState.getCurrentContent());
        if (editorData) {
            text = editorData?.['blocks']?.[0]?.['text'];
            if (editorData?.entityMap) {
                Object.values(editorData?.entityMap).map(entity => {
                    if (entity['type'] == "LINK") links.push(entity['data']['url']);
                    if (entity['type'] == "IMAGE") images.push(entity['data']['src']);
                    if (entity['type'] == "EMBEDDED_LINK") embeddedLinks.push(entity['data']['src']);
                })
            }
        }
        let callDone = {
            Outcome, // Call Outcome
            CallRating, // Call quality rating
            text, links, images, embeddedLinks, // Notes

            CallSid: JSON.stringify(call['object']['parameters']['CallSid']), // Call SID Twilio
        };
        console.log("**********callDone::", callDone);
        dispatch(setCallDone(callDone));
    };

    const editorPad = () => {
        return <>
            <Editor
                editorClassName="editorClassName"
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                onEditorStateChange={(e) => setEditorState(e)}
            />
        </>
    }

    const callTwilio = [{
        minWidth: 250,
        Header: 'Task',
        id: 'hs_task_subject',
        accessor: task => task['hs_task_subject']?.substring(0, 100) || '-'
    }, {
        minWidth: 70,
        id: 'company_name',
        Header: 'Company',
        accessor: task => <a href={task['website']} target='_blank'>{task['company_name']}</a>
    }, {
        minWidth: 70,
        id: 'country',
        Header: 'Country',
        accessor: task => <>{task['job_country']}</>
    }, {
        minWidth: 70,
        id: 'platform',
        Header: 'Platform',
        accessor: task => <>{task['job_platform']}</>
    }, {
        minWidth: 100,
        id: 'job_title',
        Header: 'Job Hiring Title',
        accessor: task => <>{task['job_title']}</>
    }, {
        minWidth: 70,
        id: 'contacts',
        Header: 'Contact',
        accessor: task => <Button className='call-button' color="primary" onClick={() => { setModalOpen(true); setTask(task); }}><VisibilityIcon color="primary" /> &nbsp; {task['contacts'].length} Contacts</Button>
    }];

    // 👇️ toggle isTextShow state on click
    const handleClick = event => setIsTextShow(current => !current);

    return (
        <Row>
            <Card className="card-table">
                <CardHeader>
                    <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                        <div tag="h2">Calling Tasks ({callTasks.length}) </div>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <ReactTable
                        minRows={20}
                        className="table"
                        filterable={true}
                        columns={callTwilio}
                        data={callTasks || []}
                        resolveData={callTasks => callTasks ? callTasks.map(row => row) : []}
                    />
                </CardBody>
            </Card>

            <Modal isOpen={modalOpen} className={`main-modal right-template-company`}>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)} className="close-btn tim-icons icon-minimal-right"></ModalHeader>
                <ModalBody>
                    <div className='content-area'>
                        <div className='center-content-area'>
                            <div className='company-info shadow'>
                                <h2><b>Company: </b>
                                    <a href={task['company_website']} target='_blank'>{task['company_name']}
                                        <i className='icon'><svg class="svg-icon" viewBox="0 0 1039 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1011.296677 412.899958 607.720062 98.818633c-58.950623-46.784536-132.378983-46.904263-191.095269-0.177032L12.81384 412.899958c-13.114692 10.160407-15.358803 30.873148-5.139044 43.809785 10.278087 12.995989 29.299303 17.10968 42.176588 7.125281l78.413907-61.024865 0 367.366925c0 121.391744 51.42523 188.743712 173.997869 188.743712l423.422615 0c122.573663 0 169.83199-69.88465 169.83199-191.334723L895.517767 402.582985l78.682014 61.252039c5.434779 4.253884 11.990079 6.323009 18.548448 6.323009 8.859785 0 17.721617-4.924149 23.629163-12.424984C1026.596128 444.797435 1024.352017 423.061388 1011.296677 412.899958zM639.705544 895.579165 383.741871 895.579165 383.741871 639.492696l255.963673 0L639.705544 895.579165zM831.761698 766.780731c0 79.670527-30.529317 128.798435-106.074897 128.798435l-22.01541 0 0-258.855536c-0.085958-2.705622-2.65548-60.789505-60.487629-60.789505L380.26263 575.934125c2.303462 0-60.488653-1.299599-60.488653 60.488653l0 259.156388-17.510816 0c-67.260893 0-110.643959-51.17452-110.643959-128.255059l-0.046049-413.782048 262.385942-204.199729c36.860513-29.241998 79.271438-29.299303 116.487038 0.176009l261.314541 203.430202L831.760674 766.780731zM703.671391 636.422777l0 0.300852C703.677531 636.916011 703.671391 636.836193 703.671391 636.422777z" /></svg></i>
                                    </a>
                                </h2>
                                <h4><b>Hiring Job Title: </b>
                                    <a href={task['job_link']} target='_blank'>{task['job_title']}
                                        <i className='icon'>
                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256">
                                                <g>
                                                    <g>
                                                        <path fill="#000000" d="M229.1,40.5c-0.2-0.1-0.4-0.2-0.6-0.4c-0.4-0.2-0.7-0.3-1.1-0.5c-0.6-0.3-1.2-0.6-1.9-0.9c-0.1,0-0.2-0.1-0.3-0.1c-2.9-1.2-6-2-9.3-2.3c-0.2,0-0.4,0-0.7,0c-0.9-0.1-1.8-0.1-2.8-0.1l0,0h-39.1V24.2c0-5.3-4.3-9.6-9.6-9.6H92.2c-5.3,0-9.6,4.3-9.6,9.6v11.8H43.5C25,36.1,10,51,10,69.5v72.5v65.9l0,0c0,12.5,6.8,23.3,16.9,29.1c0.2,0.1,0.4,0.2,0.6,0.4c0.3,0.1,0.6,0.3,0.9,0.4c3.6,1.8,7.5,3,11.7,3.4c0.2,0,0.4,0,0.7,0c0.9,0.1,1.8,0.1,2.8,0.1l0,0h105.6h63.5c18.5,0,33.5-15,33.5-33.5v-72.5V69.5l0,0C246,57,239.2,46.2,229.1,40.5z M101.7,39.1c0-1.6,2.2-3,5-3h42.6c2.7,0,5,1.3,5,3v5.1c0,1.6-2.2,3-5,3h-42.6c-2.7,0-5-1.3-5-3L101.7,39.1L101.7,39.1z M97.4,69.9c21.4,0,38.7,17.3,38.7,38.7c0,21.4-17.3,38.7-38.7,38.7c-21.4,0-38.7-17.3-38.7-38.7C58.6,87.3,76,69.9,97.4,69.9z M37.4,207.5c0-33.1,26.9-60,60-60H98c33.1,0,60,26.9,60,60H37.4z M220,128.9h-49.6c-2.8,0-5.1-2.3-5.1-5.1c0-2.8,2.3-5.1,5.1-5.1H220c2.8,0,5.1,2.3,5.1,5.1C225.2,126.6,222.9,128.9,220,128.9z M220,96.4h-49.6c-2.8,0-5.1-2.3-5.1-5.1c0-2.8,2.3-5.1,5.1-5.1H220c2.8,0,5.1,2.3,5.1,5.1C225.2,94.1,222.9,96.4,220,96.4z" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </i>
                                    </a>
                                </h4>
                                <h4><b>Deal Name:</b>
                                    <a href={`https://app.hubspot.com/contacts/20532387/record/0-3/${task['dealId']}`} target='_blank'>
                                        {task['dealname']}
                                        <i className='icon'>
                                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 935.996 935.996">
                                                <g>
                                                    <g>
                                                        <g>
                                                            <path d="M76.416,653.994c-0.738-0.698-1.469-1.405-2.191-2.129c-20.776-20.774-32.218-48.399-32.218-77.781V91.273
                                                            c0-10.925,2.949-21.168,8.072-30H30c-16.569,0-30,13.431-30,30v482.81C0,617.066,33.898,652.119,76.416,653.994z"/>
                                                            <path d="M466.439,167.209c-37.812,0-62.039,32.671-62.039,86.268c0,53.963,24.229,88.47,62.039,88.47
                                                            c37.809,0,62.04-34.507,62.04-88.47C528.479,199.88,504.25,167.209,466.439,167.209z"/>
                                                            <path d="M663.203,326.476c16.695,3.021,33.004,7.845,48.791,14.442c27.19-2.972,42.25-16.047,42.25-39.72
                                                            c0-24.962-19.09-36.71-55.064-36.71h-35.977V326.476L663.203,326.476z"/>
                                                            <path d="M741.396,198.779c0-22.026-15.785-31.203-46.988-31.203h-31.203v66.444h30.469
                                                            C727.078,234.02,741.396,221.172,741.396,198.779z"/>
                                                            <path d="M152.007,654.083h251.63c-0.354-0.809-0.718-1.612-1.063-2.43c-11.71-27.686-17.939-56.992-18.56-87.18H185.73
                                                            c-8.284,0-15-6.717-15-15c0-8.285,6.716-15,15-15h199.533c2.204-21.082,7.203-41.642,14.963-61.41H185.73
                                                            c-8.284,0-15-6.715-15-15s6.716-15,15-15H414.5c10.515-18.622,23.498-35.718,38.81-51.03c4.551-4.551,9.269-8.885,14.128-13.022
                                                            c-0.334,0.003-0.665,0.012-1,0.012c-62.406,0-105.725-47.724-105.725-125.547c0-77.458,43.317-123.344,105.725-123.344
                                                            c62.772,0,106.09,45.887,106.09,123.344c0,31.861-7.265,58.673-20.148,79.234c22.021-6.643,44.877-10.018,68.24-10.029V134.537
                                                            h76.723c49.56,0,85.9,15.051,85.9,59.102c0,22.76-13.215,44.786-41.115,52.128v1.468c34.506,5.874,53.596,24.596,53.596,56.899
                                                            c0,30.077-15.364,50.103-39.809,60.885c11.469,7.987,22.254,16.999,32.271,27.015c19.976,19.975,35.996,42.984,47.722,68.465
                                                            c1.033,2.248,2.047,4.508,3.014,6.793c12.355,29.213,18.621,60.227,18.621,92.182c0,31.953-6.266,62.967-18.621,92.18
                                                            c-0.25,0.588-0.514,1.168-0.768,1.754c39.344-5.031,69.76-38.612,69.76-79.324V91.273c0-16.569-13.43-30-30-30h-72.004H102.007
                                                            c-16.568,0-30,13.431-30,30v482.811C72.007,618.267,107.825,654.083,152.007,654.083z M199.561,316.617
                                                            c9.545,17.621,22.76,25.33,37.444,25.33c22.393,0,33.773-12.114,33.773-46.254V134.537h42.583v164.826
                                                            c0,43.685-21.292,79.66-71.583,79.66c-33.406,0-56.533-13.95-71.584-40.747L199.561,316.617z"/>
                                                            <path d="M788.188,726.914c-11.772,11.773-24.606,22.164-38.37,31.125l102.289,102.289c9.596,9.597,22.172,14.396,34.747,14.396
                                                            c12.578,0,25.152-4.799,34.75-14.396c19.189-19.188,19.189-50.305,0-69.496L819.312,688.541
                                                            C810.354,702.306,799.961,715.14,788.188,726.914z"/>
                                                            <path d="M432.832,473.064c-8.789,19.082-14.756,39.729-17.369,61.41c-0.987,8.195-1.509,16.535-1.509,25
                                                            c0,1.672,0.024,3.338,0.063,5c0.765,32.236,8.908,62.646,22.806,89.608c2.644,5.132,5.504,10.132,8.554,15
                                                            c3.23,5.156,6.677,10.162,10.335,15c37.751,49.923,97.623,82.187,165.037,82.187c39.293,0,76.025-10.961,107.311-29.988
                                                            c22.388-13.617,41.978-31.373,57.726-52.197c3.66-4.838,7.104-9.844,10.336-15c0.479-0.766,0.965-1.526,1.436-2.301
                                                            c2.519-4.139,4.892-8.377,7.117-12.699c4.596-8.911,8.559-18.2,11.836-27.807c7.15-20.957,11.035-43.426,11.035-66.803
                                                            c0-81.051-46.635-151.197-114.527-185.105c-27.776-13.873-59.106-21.69-92.268-21.69c-0.043,0-0.086,0.002-0.129,0.002
                                                            c-70.984,0.043-133.594,35.854-170.801,90.383C443.36,452.53,437.669,462.561,432.832,473.064z"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </i>
                                    </a>
                                </h4>
                                <div className={isTextShow ? 'text-readmore show' : 'text-readmore'}>
                                    <h4><b>Deal Description: </b></h4>
                                    <p> {task['job_description']} </p>
                                    <button className='icon-btn show-btn' onClick={handleClick}>Show More</button>
                                    <button className='icon-btn less-btn' onClick={handleClick}>Show Less</button>
                                </div>
                            </div>
                            <div className='table-area'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Job Hiring</th>
                                            <th>Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {task['contacts']?.map((contact, index) => (
                                            <tr>
                                                <td>
                                                    <a href={contact['linkedin_profile_url']} target='_blank'>{contact['firstname']} {contact['lastname']}</a>&nbsp;
                                                    <a href={`https://app.hubspot.com/contacts/20532387/record/0-1/${contact['hs_object_id']}`} target='_blank'>
                                                        <i className='icon'><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 489 511.8"><path fill="#FF7A59" fill-rule="nonzero" d="M375.25 168.45V107.5c16.43-7.68 26.97-24.15 27.08-42.29V63.8c0-25.95-21.05-46.99-47-46.99h-1.37c-25.95 0-46.99 21.04-46.99 46.99v1.41a46.985 46.985 0 0027.29 42.3v60.94c-23.13 3.53-44.98 13.18-63.19 27.84L103.88 66.16c1.19-4.29 1.83-8.73 1.89-13.17v-.11C105.77 23.68 82.09 0 52.88 0 23.68 0 0 23.68 0 52.88c0 29.18 23.64 52.85 52.81 52.89 9.17-.08 18.16-2.59 26.06-7.23l164.62 128.07a133.501 133.501 0 00-22.16 73.61c0 27.39 8.46 54.17 24.18 76.58l-50.06 50.06a43.926 43.926 0 00-12.43-1.81c-23.96 0-43.38 19.42-43.38 43.37 0 23.96 19.42 43.38 43.38 43.38 23.95 0 43.37-19.42 43.37-43.38v-.13a41.81 41.81 0 00-2.02-12.5l49.52-49.56a133.687 133.687 0 0081.54 27.78c73.76 0 133.57-59.81 133.57-133.57 0-66.05-48.3-122.2-113.61-132.06l-.14.07zm-20.39 200.4c-36.79-1.52-65.85-31.79-65.85-68.62 0-35.43 26.97-65.06 62.23-68.38h3.62c35.8 2.73 63.46 32.58 63.46 68.48 0 35.91-27.66 65.76-63.45 68.48l-.01.04zm0 0z" /></svg></i>
                                                    </a>
                                                </td>
                                                <td>
                                                    {contact['jobtitle']}
                                                    <a href={contact['linkedin_profile_url']} target='_blank'>
                                                        <i className='icon'>
                                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256">
                                                                <g>
                                                                    <g>
                                                                        <path fill="#000000" d="M229.1,40.5c-0.2-0.1-0.4-0.2-0.6-0.4c-0.4-0.2-0.7-0.3-1.1-0.5c-0.6-0.3-1.2-0.6-1.9-0.9c-0.1,0-0.2-0.1-0.3-0.1c-2.9-1.2-6-2-9.3-2.3c-0.2,0-0.4,0-0.7,0c-0.9-0.1-1.8-0.1-2.8-0.1l0,0h-39.1V24.2c0-5.3-4.3-9.6-9.6-9.6H92.2c-5.3,0-9.6,4.3-9.6,9.6v11.8H43.5C25,36.1,10,51,10,69.5v72.5v65.9l0,0c0,12.5,6.8,23.3,16.9,29.1c0.2,0.1,0.4,0.2,0.6,0.4c0.3,0.1,0.6,0.3,0.9,0.4c3.6,1.8,7.5,3,11.7,3.4c0.2,0,0.4,0,0.7,0c0.9,0.1,1.8,0.1,2.8,0.1l0,0h105.6h63.5c18.5,0,33.5-15,33.5-33.5v-72.5V69.5l0,0C246,57,239.2,46.2,229.1,40.5z M101.7,39.1c0-1.6,2.2-3,5-3h42.6c2.7,0,5,1.3,5,3v5.1c0,1.6-2.2,3-5,3h-42.6c-2.7,0-5-1.3-5-3L101.7,39.1L101.7,39.1z M97.4,69.9c21.4,0,38.7,17.3,38.7,38.7c0,21.4-17.3,38.7-38.7,38.7c-21.4,0-38.7-17.3-38.7-38.7C58.6,87.3,76,69.9,97.4,69.9z M37.4,207.5c0-33.1,26.9-60,60-60H98c33.1,0,60,26.9,60,60H37.4z M220,128.9h-49.6c-2.8,0-5.1-2.3-5.1-5.1c0-2.8,2.3-5.1,5.1-5.1H220c2.8,0,5.1,2.3,5.1,5.1C225.2,126.6,222.9,128.9,220,128.9z M220,96.4h-49.6c-2.8,0-5.1-2.3-5.1-5.1c0-2.8,2.3-5.1,5.1-5.1H220c2.8,0,5.1,2.3,5.1,5.1C225.2,94.1,222.9,96.4,220,96.4z" />
                                                                    </g>
                                                                </g>
                                                            </svg>
                                                        </i>
                                                    </a>
                                                </td>
                                                <td>
                                                    {contact['company']}
                                                    <a href={contact['website']} target='_blank'>
                                                        <i className='icon'><svg class="svg-icon" viewBox="0 0 1039 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1011.296677 412.899958 607.720062 98.818633c-58.950623-46.784536-132.378983-46.904263-191.095269-0.177032L12.81384 412.899958c-13.114692 10.160407-15.358803 30.873148-5.139044 43.809785 10.278087 12.995989 29.299303 17.10968 42.176588 7.125281l78.413907-61.024865 0 367.366925c0 121.391744 51.42523 188.743712 173.997869 188.743712l423.422615 0c122.573663 0 169.83199-69.88465 169.83199-191.334723L895.517767 402.582985l78.682014 61.252039c5.434779 4.253884 11.990079 6.323009 18.548448 6.323009 8.859785 0 17.721617-4.924149 23.629163-12.424984C1026.596128 444.797435 1024.352017 423.061388 1011.296677 412.899958zM639.705544 895.579165 383.741871 895.579165 383.741871 639.492696l255.963673 0L639.705544 895.579165zM831.761698 766.780731c0 79.670527-30.529317 128.798435-106.074897 128.798435l-22.01541 0 0-258.855536c-0.085958-2.705622-2.65548-60.789505-60.487629-60.789505L380.26263 575.934125c2.303462 0-60.488653-1.299599-60.488653 60.488653l0 259.156388-17.510816 0c-67.260893 0-110.643959-51.17452-110.643959-128.255059l-0.046049-413.782048 262.385942-204.199729c36.860513-29.241998 79.271438-29.299303 116.487038 0.176009l261.314541 203.430202L831.760674 766.780731zM703.671391 636.422777l0 0.300852C703.677531 636.916011 703.671391 636.836193 703.671391 636.422777z" /></svg></i>
                                                    </a>
                                                </td>
                                                <td>
                                                    {contact['job_title']}
                                                    <a href={task['job_link']} target='_blank'>
                                                        <i className='icon'><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 935.996 935.996">
                                                            <g>
                                                                <g>
                                                                    <g>
                                                                        <path d="M76.416,653.994c-0.738-0.698-1.469-1.405-2.191-2.129c-20.776-20.774-32.218-48.399-32.218-77.781V91.273
                                                                            c0-10.925,2.949-21.168,8.072-30H30c-16.569,0-30,13.431-30,30v482.81C0,617.066,33.898,652.119,76.416,653.994z"/>
                                                                        <path d="M466.439,167.209c-37.812,0-62.039,32.671-62.039,86.268c0,53.963,24.229,88.47,62.039,88.47
                                                                            c37.809,0,62.04-34.507,62.04-88.47C528.479,199.88,504.25,167.209,466.439,167.209z"/>
                                                                        <path d="M663.203,326.476c16.695,3.021,33.004,7.845,48.791,14.442c27.19-2.972,42.25-16.047,42.25-39.72
                                                                            c0-24.962-19.09-36.71-55.064-36.71h-35.977V326.476L663.203,326.476z"/>
                                                                        <path d="M741.396,198.779c0-22.026-15.785-31.203-46.988-31.203h-31.203v66.444h30.469
                                                                            C727.078,234.02,741.396,221.172,741.396,198.779z"/>
                                                                        <path d="M152.007,654.083h251.63c-0.354-0.809-0.718-1.612-1.063-2.43c-11.71-27.686-17.939-56.992-18.56-87.18H185.73
                                                                            c-8.284,0-15-6.717-15-15c0-8.285,6.716-15,15-15h199.533c2.204-21.082,7.203-41.642,14.963-61.41H185.73
                                                                            c-8.284,0-15-6.715-15-15s6.716-15,15-15H414.5c10.515-18.622,23.498-35.718,38.81-51.03c4.551-4.551,9.269-8.885,14.128-13.022
                                                                            c-0.334,0.003-0.665,0.012-1,0.012c-62.406,0-105.725-47.724-105.725-125.547c0-77.458,43.317-123.344,105.725-123.344
                                                                            c62.772,0,106.09,45.887,106.09,123.344c0,31.861-7.265,58.673-20.148,79.234c22.021-6.643,44.877-10.018,68.24-10.029V134.537
                                                                            h76.723c49.56,0,85.9,15.051,85.9,59.102c0,22.76-13.215,44.786-41.115,52.128v1.468c34.506,5.874,53.596,24.596,53.596,56.899
                                                                            c0,30.077-15.364,50.103-39.809,60.885c11.469,7.987,22.254,16.999,32.271,27.015c19.976,19.975,35.996,42.984,47.722,68.465
                                                                            c1.033,2.248,2.047,4.508,3.014,6.793c12.355,29.213,18.621,60.227,18.621,92.182c0,31.953-6.266,62.967-18.621,92.18
                                                                            c-0.25,0.588-0.514,1.168-0.768,1.754c39.344-5.031,69.76-38.612,69.76-79.324V91.273c0-16.569-13.43-30-30-30h-72.004H102.007
                                                                            c-16.568,0-30,13.431-30,30v482.811C72.007,618.267,107.825,654.083,152.007,654.083z M199.561,316.617
                                                                            c9.545,17.621,22.76,25.33,37.444,25.33c22.393,0,33.773-12.114,33.773-46.254V134.537h42.583v164.826
                                                                            c0,43.685-21.292,79.66-71.583,79.66c-33.406,0-56.533-13.95-71.584-40.747L199.561,316.617z"/>
                                                                        <path d="M788.188,726.914c-11.772,11.773-24.606,22.164-38.37,31.125l102.289,102.289c9.596,9.597,22.172,14.396,34.747,14.396
                                                                            c12.578,0,25.152-4.799,34.75-14.396c19.189-19.188,19.189-50.305,0-69.496L819.312,688.541
                                                                            C810.354,702.306,799.961,715.14,788.188,726.914z"/>
                                                                        <path d="M432.832,473.064c-8.789,19.082-14.756,39.729-17.369,61.41c-0.987,8.195-1.509,16.535-1.509,25
                                                                            c0,1.672,0.024,3.338,0.063,5c0.765,32.236,8.908,62.646,22.806,89.608c2.644,5.132,5.504,10.132,8.554,15
                                                                            c3.23,5.156,6.677,10.162,10.335,15c37.751,49.923,97.623,82.187,165.037,82.187c39.293,0,76.025-10.961,107.311-29.988
                                                                            c22.388-13.617,41.978-31.373,57.726-52.197c3.66-4.838,7.104-9.844,10.336-15c0.479-0.766,0.965-1.526,1.436-2.301
                                                                            c2.519-4.139,4.892-8.377,7.117-12.699c4.596-8.911,8.559-18.2,11.836-27.807c7.15-20.957,11.035-43.426,11.035-66.803
                                                                            c0-81.051-46.635-151.197-114.527-185.105c-27.776-13.873-59.106-21.69-92.268-21.69c-0.043,0-0.086,0.002-0.129,0.002
                                                                            c-70.984,0.043-133.594,35.854-170.801,90.383C443.36,452.53,437.669,462.561,432.832,473.064z"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </svg>
                                                        </i>
                                                    </a>
                                                </td>
                                                <td className='row'>
                                                    {contact['status'] === 'Connected' ?
                                                        <Button className='call-button' onClick={() => disconnetCall(index)} color='secondary'><CallEndIcon color="secondary" /><span class="tooltiptext">{`Personal: ${contact['phone']}`}</span></Button>
                                                        :
                                                        <Button className='call-button' onClick={() => connectCall(contact, 'phone', index)}><CallIcon color="info" /><span class="tooltiptext">{`Personal: ${contact['phone']}`}</span></Button>
                                                    }
                                                    {contact['phone'] != contact['mobilephone'] && contact['mobilephone'] && contact['status'] === 'Connected' ?
                                                        <Button className='call-button' onClick={() => disconnetCall(index)} color='secondary'><CallEndIcon color="secondary" /><span class="tooltiptext">{`Bussiness: ${contact['mobilephone']}`}</span></Button>
                                                        :
                                                        <Button className='call-button' onClick={() => connectCall(contact, 'mobilephone', index)}><CallIcon color="info" /><span class="tooltiptext">{`Bussiness: ${contact['mobilephone']}`}</span></Button>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {call['status'] &&
                                <div className={call['status'] === 'Connected' ? "notpad-area" : "notpad-area active"}>
                                    <div className='note-area'>
                                        <div className='top-header-sec'>
                                            <div className='left-area'>
                                                <h4>{call['contact']['firstname']} {call['contact']['lastname']}</h4>
                                                <p>{call['phone']}</p>
                                            </div>
                                            <div className='right-area'>
                                                <p className='timer'> <Timer /> </p>
                                                <Button className='call-button' color='secondary' onClick={disconnetCall}><CallEndIcon color="secondary" /></Button>
                                            </div>
                                        </div>
                                        <div className='record-area'>
                                            <div className='left-area'>
                                                <button className='mute-btn' onClick={() => setMute(!mute)}>
                                                    <i className='icon'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" id="mic" x="0" y="0" version="1.1" viewBox="0 0 29 29">
                                                            <path d="M14.5 17a3.5 3.5 0 0 1-3.5-3.5v-8a3.5 3.5 0 1 1 7 0v8a3.5 3.5 0 0 1-3.5 3.5z"></path>
                                                            <path d="M20 10v3.5c0 3.032-2.468 5.5-5.5 5.5S9 16.532 9 13.5V10H7v3.5c0 3.796 2.837 6.934 6.5 7.425V25H10v2h9v-2h-3.5v-4.075c3.663-.491 6.5-3.629 6.5-7.425V10h-2z"></path>
                                                        </svg>
                                                    </i>
                                                    Mute
                                                </button>
                                                <button className='mute-btn' onClick={() => setEditorActive(!isEditorActive)}>
                                                    <i className='icon'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32" viewBox="0 0 32 32" id="keypad">
                                                            <path d="M.5 5.31c0 2.64996 2.15997 4.79999 4.81 4.79999S10.10999 7.95996 10.10999 5.31c0-2.65002-2.14996-4.81-4.79999-4.81S.5 2.65997.5 5.31zM16 .5c-2.65002 0-4.81 2.15997-4.81 4.81 0 2.64996 2.15997 4.79999 4.81 4.79999S20.81 7.95996 20.81 5.31C20.81 2.65997 18.65002.5 16 .5zM26.69.5c-2.65002 0-4.79999 2.15997-4.79999 4.81 0 2.64996 2.14996 4.79999 4.79999 4.79999S31.5 7.95996 31.5 5.31C31.5 2.65997 29.34003.5 26.69.5zM5.31 20.81c2.65002 0 4.79999-2.16003 4.79999-4.81 0-2.65002-2.14996-4.81-4.79999-4.81S.5 13.34998.5 16C.5 18.64996 2.65997 20.81 5.31 20.81z"></path><circle cx="16" cy="16" r="4.81"></circle><path d="M26.69 11.19c-2.65002 0-4.79999 2.15997-4.79999 4.81 0 2.64996 2.14996 4.81 4.79999 4.81S31.5 18.64996 31.5 16C31.5 13.34998 29.34003 11.19 26.69 11.19zM5.31 31.5c2.65002 0 4.79999-2.16003 4.79999-4.81 0-2.65002-2.14996-4.79999-4.79999-4.79999S.5 24.03998.5 26.69C.5 29.33997 2.65997 31.5 5.31 31.5zM16 21.89001c-2.65002 0-4.81 2.14996-4.81 4.79999 0 2.64996 2.15997 4.81 4.81 4.81s4.81-2.16003 4.81-4.81C20.81 24.03998 18.65002 21.89001 16 21.89001zM26.69 21.89001c-2.65002 0-4.79999 2.14996-4.79999 4.79999 0 2.64996 2.14996 4.81 4.79999 4.81s4.81-2.16003 4.81-4.81C31.5 24.03998 29.34003 21.89001 26.69 21.89001z"></path>
                                                        </svg>
                                                    </i>
                                                    Keypad
                                                </button>
                                            </div>
                                            <div className='right-area'>
                                                <div className='voice-area'>
                                                    <div id="volume-indicators" class="">
                                                        <div className='volume-indicators-box'>
                                                            <label>Mic Volume</label>
                                                            <div id="input-volume" style={{ width: '15px', background: "green" }}></div>
                                                        </div>
                                                        <div className='volume-indicators-box'>
                                                            <label>Speaker Volume</label>
                                                            <div id="output-volume" style={{ width: '15px', background: "green" }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="dropdown">
                                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className='icon'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 2" viewBox="0 0 35 35" id="support"><path d="M29.07,16.57a1.25,1.25,0,0,1-1.25-1.25V11.79c0-5-4.62-9-10.3-9s-10.3,4.05-10.3,9v3.53a1.25,1.25,0,0,1-2.5,0V11.79C4.72,5.43,10.47.25,17.52.25s12.8,5.18,12.8,11.54v3.53A1.24,1.24,0,0,1,29.07,16.57Z"></path><path d="M25.69 28.33a1.25 1.25 0 0 1-1.25-1.25V15.21A1.25 1.25 0 0 1 25.69 14c4.31 0 7.82 3.23 7.82 7.19S30 28.33 25.69 28.33zm1.25-11.74V25.7A4.86 4.86 0 0 0 31 21.15 4.86 4.86 0 0 0 26.94 16.59zM9.31 28.33c-4.31 0-7.82-3.22-7.82-7.18S5 14 9.31 14a1.25 1.25 0 0 1 1.25 1.25V27.08A1.25 1.25 0 0 1 9.31 28.33zM8.06 16.59A4.86 4.86 0 0 0 4 21.15 4.86 4.86 0 0 0 8.06 25.7z"></path><path d="M25.28,32.4H21.14a1.25,1.25,0,0,1,0-2.5h4.14a2.44,2.44,0,0,0,2.44-2.44v-.55a1.25,1.25,0,1,1,2.5,0v.55A4.94,4.94,0,0,1,25.28,32.4Z"></path><path d="M19,34.75H16.53a3.42,3.42,0,0,1-3.42-3.42v-.14a3.42,3.42,0,0,1,3.42-3.41H19a3.41,3.41,0,0,1,3.41,3.41v.14A3.42,3.42,0,0,1,19,34.75Zm-2.45-4.47a.92.92,0,0,0-.92.91v.14a.92.92,0,0,0,.92.92H19a.92.92,0,0,0,.91-.92v-.14a.91.91,0,0,0-.91-.91Z"></path></svg>
                                                        </i>
                                                        <p>Audio</p>
                                                    </button>
                                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <a class="dropdown-item" href="#">Action</a>
                                                        <a class="dropdown-item" href="#">Another action</a>
                                                        <a class="dropdown-item" href="#">Something else here</a>
                                                    </div>
                                                </div>
                                                <button className='network-icon'>
                                                    <i className='icon'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="network"><path fill="#6563ff" d="M5 22a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zm5 0a1 1 0 0 1-1-1v-6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zm5 0a1 1 0 0 1-1-1V10a1 1 0 0 1 2 0v11a1 1 0 0 1-1 1zm5 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"></path></svg>
                                                    </i>
                                                    Network
                                                </button>
                                            </div>
                                        </div>
                                        <div className={isEditorActive ? "editor-pad" : "editor-pad active"}>
                                            <div className='editor'>
                                                {/* Before Call Editor Pad */}
                                                {editorPad()}
                                            </div>
                                            <div className='dialpad'>
                                                {/* Dail Pad */}
                                                <Dialpad call={call} setCall={setCall} />
                                                <div className='footer-area' onClick={() => setEditorActive(!isEditorActive)}>
                                                    <button>Dismiss</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='note-area style-two'>
                                        <div className='top-header-sec'>
                                            <div className='left-area'>
                                                <h4>
                                                    <i className='icon tim-icons icon-check-2'></i>
                                                    Call duration <Timer />
                                                </h4>
                                            </div>
                                            <div className='right-area'>
                                                <ul className='connect-list'>
                                                    <li className='ringing-color'>Ringing</li>
                                                    <li className='connecting-color'>Connecting</li>
                                                    <li className='reconnecting-color'>Reconnecting</li>
                                                    <li className='connected-color'>Connected</li>
                                                </ul>
                                                <Button className='close-btn' onClick={() => setCall({})}>
                                                    <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='record-area'>
                                            <div className='label-area'>
                                                <div className='group-form'>
                                                    <label>Lables*</label>
                                                    <Select
                                                        value={Outcome || 'Select an outcome'}
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                        onChange={(e) => setOutcome(e['target']['value'])}
                                                    >
                                                        <MenuItem value="Select an outcome"> Select an outcome </MenuItem>
                                                        <MenuItem value='Busy'>Busy</MenuItem>
                                                        <MenuItem value='Connected'>Connected</MenuItem>
                                                        <MenuItem value='Left live message'>Left live message</MenuItem>
                                                        <MenuItem value='Left voicemail'>Left voicemail</MenuItem>
                                                        <MenuItem value='No answer'>No answer</MenuItem>
                                                        <MenuItem value='Wrong number'>Wrong number</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="editor-pad">
                                            <div className='editor'>
                                                {/* After Call Editor Pad */}
                                                {editorPad()}
                                                <div className='ratings-area'>
                                                    <div className='rating'>
                                                        <p>Rate call quality</p>
                                                        <Rating
                                                            value={CallRating}
                                                            name="simple-controlled"
                                                            onChange={(e) => setCallRating(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='new-task-create'>
                                                    <button className='btn-style-one' onClick={submitCall}>Log Call</button>
                                                    {/* <button className='btn-style-one'>Create New Task</button>
                                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Create a follow up task" /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='next-back-area'>
                            <button className='btn-style-two' onClick={() => moveTask('Back')}><i className='tim-icons icon-minimal-left' /> Back</button>
                            <div className='skip-task'>
                                <button className='btn-style-one' onClick={() => moveTask('Next')}><SkipNextIcon color="secondary" /> &nbsp; Skip Task</button>
                                <button className='btn-style-one' onClick={() => dispatch(callTaskCompleted(task['taskId']))}><DoneAllIcon style={{ color: green[500] }} /> &nbsp; Complete Task</button>
                            </div>
                            <button className='btn-style-two' onClick={() => moveTask('Next')}>Next <i className='tim-icons icon-minimal-right' /></button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </Row >
    );
};

export default withRouter(Integrations);