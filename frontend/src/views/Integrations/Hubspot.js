import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReactTable from 'react-table-6';
import { withRouter } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import SyncIcon from '@material-ui/icons/Sync';
import { green } from '@material-ui/core/colors';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import FormControl from '@material-ui/core/FormControl';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Row, Card, CardHeader, CardBody, CardTitle } from "reactstrap";

import "./index.css";
import { createLists, syncInstantlyLeads, deleteList, hubspotTaskDone, completeList } from '../../store/actions/Integration';

const Integrations = () => {

    const [list, setList] = useState({});
    const [campaign, setCampaign] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const dispatch = useDispatch();
    const { campaigns, lists } = useSelector(state => state['Integration']);


  

    const syncLeads = () => {
        let campaignId = (campaigns.find(({ campaign_name }) => campaign === campaign_name))['campaign_id'];
        if (!campaignId) return alert('Unable to find campaign');
        setModalOpen(false);
        dispatch(syncInstantlyLeads({ listId: list['_id'], campaignId }));
    };

    const hubspotListColumns = [{
        id: 'name',
        minWidth: 150,
        Header: 'Name',
        accessor: list => list['name'] ? list['name'] : '-'
    }, {
        id: 'deals',
        minWidth: 65,
        Header: 'Deals',
        resizable: false,
        filterable: false,
        accessor: list => list['count']['Deals'] ? list['count']['Deals'] : '-'
    }, {
        minWidth: 65,
        id: 'contacts',
        resizable: false,
        filterable: false,
        Header: 'Contacts',
        accessor: list => list['count']['Contacts'] ? list['count']['Contacts'] : '-'
    }, {
        id: 'tasks',
        minWidth: 65,
        Header: 'Tasks',
        resizable: false,
        filterable: false,
        accessor: list => list['count']['Tasks'] ? list['count']['Tasks'] : '-'
    }, {
        minWidth: 80,
        id: 'linkedin',
        resizable: false,
        filterable: false,
        Header: 'Linkedin CSV',
        accessor: list => {
            let linkedinList = list['files'].find(({ type }) => type == 'Linkedin');
            if (list?.['files'].length > 0) return (<a href={linkedinList['Location']} target='_blank'>{<CloudDownloadIcon color="primary" />}</a>)
        }
    }, {
        id: 'email',
        minWidth: 80,
        resizable: false,
        filterable: false,
        Header: 'Email CSV',
        accessor: list => {
            let emailList = list['files'].find(({ type }) => type == 'Email');
            if (list?.['files'].length > 0) return (<a href={emailList['Location']} target='_blank'>{<CloudDownloadIcon color="primary" />}</a>)
        }
    }, {
        id: 'status',
        minWidth: 70,
        Header: 'Status',
        filterable: false,
        accessor: list =>
            <div className='content-area'>
                <button className={`status-btn ${list['status'].toLowerCase()}-btn`}>{list['status'].toUpperCase()}</button>
            </div>,
    }, {
        id: 'action',
        minWidth: 200,
        Header: 'Action',
        filterable: false,
        accessor: list => {
            if (list['status'] == 'Pending')
                return (
                    <>
                        <button className='action-btn' onClick={() => dispatch(hubspotTaskDone(list['_id']))}>
                            <CheckCircleIcon /> Hubspot Task Done
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button className='delete-btn' onClick={() => dispatch(deleteList(list['_id']))}>
                            <DeleteIcon /> Delete List
                        </button>
                    </>
                );
            else if (list['status'] == 'In-Progress')
                return (
                    <button className='action-btn' onClick={() => { setModalOpen(true); setList(list); }}>
                        <SyncIcon /> Leads to Instantly
                    </button>
                );
            else if (list['status'] == 'In-Review')
                return (
                    <button className='action-btn' onClick={() => dispatch(completeList(list['_id']))}>
                        <DoneAllIcon sx={{ color: green[500] }} /> Mark Completed
                    </button>
                );
        },
    }];

    return (
        <>
            <Row>
                <Card className="card-table">
                    <CardHeader>
                        <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                            <div tag="h2">Hubspot Lists</div>
                            <button className="btn-style-one" onClick={() => dispatch(createLists())} >
                                Export Today's Leads
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            minRows={8}
                            className="table"
                            filterable={true}
                            data={lists || []}
                            columns={hubspotListColumns}
                            resolveData={lists => lists ? lists.map(row => row) : []}
                        />
                    </CardBody>
                </Card>
            </Row>

            <Modal isOpen={modalOpen} className={`main-modal new-user-modal`}>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}></ModalHeader>
                <ModalBody>
                    <div className='content-area'>
                        <h4 className='text-center font-bold'>Sync {list['name']} Leads to Instantly Campaign</h4>
                        <ValidatorForm className="validator-form mt-4" onSubmit={() => syncLeads()}>
                            <div className='row'>
                                <div className='col-lg-12 col-md-12'>
                                    <div className="group-form text-center">
                                        <label>Select Campaign</label>
                                        <FormControl fullWidth>
                                            <Select
                                                name='campaign'
                                                id='instantly-campaign'
                                                placeholder='Search your campaign'
                                                labelId='instantly-campaign-label'
                                                value={campaign}
                                                onChange={(e) => setCampaign(e['target']['value'])}
                                            >
                                                {campaigns.length > 0 && campaigns.map(campaign =>
                                                    <MenuItem value={campaign['campaign_name']} className='text-center'>{campaign['campaign_name']} &nbsp; - &nbsp;
                                                        <span className={`${campaign['status']}-status font-bold`}>{campaign['status'].toUpperCase()}</span>
                                                    </MenuItem>)
                                                };
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <div className="group-form text-center">
                                        <button className="btn-style-one" disabled={campaign ? false : true}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ValidatorForm>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default withRouter(Integrations);