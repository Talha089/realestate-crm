import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EventBus from 'eventing-bus';
import ReactTable from 'react-table-6';
import draftToHtml from 'draftjs-to-html';
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
        dispatch(setStart(false));
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
            // let taskCopy = JSON.parse(JSON.stringify(task));
            // taskCopy['contacts'][index]['status'] = 'Connected';
            // setTask(taskCopy);

            // TODO: Validate Phone Number
            let callObj = await device.connect({
                params: {
                    To: contact[type],
                    phone: contact[type],
                    // dealId: contact['dealId'],
                    // taskId: contact['taskId'],
                    // contactId: contact['hs_object_id']
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
        // if (call['status'] != 'Connected') return;

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
                editorState={editorState}
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
            <Card className="dialpad-page">
                <CardHeader>
                    <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                        <div tag="h2">DialPad </div>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <div className='content-area'>
                    <div className="notpad-area">
                        <div className='note-area'>
                            
                            <div className='top-header-sec'>
                                <div className='left-area'>
                                    <h4>Purna Peravali</h4>
                                    <p>901.347.0567</p>
                                </div>
                                <div className='right-area'>
                                    <p className='timer'> <Timer /> </p>
                                    <Button className='call-button' onClick={() => connectCall(call, 'phone', 0)}><CallIcon color="info" /></Button>
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
                                                <div id="input-volume" style={{width: "15px",  background:"green"}}></div>
                                        </div>
                                        <div className='volume-indicators-box'>
                                            <label>Speaker Volume</label>
                                            <div id="output-volume" style={{width: "15px",  background:"green"}}></div>
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
                            <div className='editor-pad'>
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
                                    {/* Editor Pad */}
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
                    </div>
                </CardBody>
            </Card>
        </Row >
    );
};

export default withRouter(Integrations);