import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Card, CardHeader, CardBody, CardTitle } from "reactstrap";

import "./index.css"
import ReactTable from 'react-table-6';
import { withRouter } from 'react-router-dom';
import SendIcon from '@material-ui/icons/Send';
import EmailIcon from '@material-ui/icons/Email';
import ReplyIcon from '@material-ui/icons/Reply';
import DraftsIcon from '@material-ui/icons/Drafts';
import ContactsIcon from '@material-ui/icons/Contacts';

const Integrations = () => {

    const { campaigns } = useSelector(state => state['Integration']);

    const instantlyCampaignColumns = [{
        minWidth: 200,
        Header: 'Name',
        id: 'campaign_name',
        accessor: campaign => campaign['campaign_name'] || '-'
    }, {
        minWidth: 100,
        id: 'total_leads',
        Header: 'Total Leads',
        accessor: campaign => <><ContactsIcon className='icon-table-instaly' color="primary" /> &nbsp; {campaign['total_leads'] || 0}</>
    }, {
        minWidth: 100,
        id: 'contacted',
        Header: 'Sent',
        accessor: campaign => <><SendIcon className='icon-table-instaly' color="primary" /> &nbsp; {campaign['contacted'] || 0}</>
    }, {
        minWidth: 100,
        Header: 'Viewed',
        id: 'leads_who_read',
        accessor: campaign => <><DraftsIcon className='icon-table-instaly' color="primary" /> &nbsp; {campaign['leads_who_read'] || 0}</>
    }, {
        minWidth: 100,
        Header: 'Replied',
        id: 'leads_who_replied',
        accessor: campaign => <><ReplyIcon className='icon-table-instaly' color="primary" /> &nbsp; {campaign['leads_who_replied'] || 0}</>
    }, {
        minWidth: 100,
        id: 'completed',
        Header: 'Delivered',
        accessor: campaign => <><EmailIcon className='icon-table-instaly' color="primary" /> &nbsp; {campaign['completed'] || 0}</>
    }, {
        id: 'status',
        minWidth: 100,
        Header: 'Status',
        accessor: campaign =>
            <div className='content-area'>
                <button className={`status-btn ${campaign['status'].toLowerCase()}-btn`}>{campaign['status'].toUpperCase()}</button>
            </div>,
        filterable: false,
    }];

    return (
        <Row>
            <Card className="card-table">
                <CardHeader>
                    <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                        <div tag="h2">Instantly Campaigns</div>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <ReactTable
                        minRows={8}
                        className="table"
                        filterable={true}
                        data={campaigns || []}
                        columns={instantlyCampaignColumns}
                        resolveData={campaigns => campaigns ? campaigns.map(row => row) : []}
                    />
                </CardBody>
            </Card>
        </Row>
    );
};

export default withRouter(Integrations);