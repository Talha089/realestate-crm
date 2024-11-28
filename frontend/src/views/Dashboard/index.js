import CountUp from 'react-countup';
import { connect } from 'react-redux';
import React, { useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import VisibilitySensor from 'react-visibility-sensor';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, } from "reactstrap";

import "./index.css"
import Loader from '../../components/Loader';
import { getDashboardStats } from '../../store/actions/Auth.js';
import { CategoryScale, LinearScale, BarElement, LineElement, PointElement, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Chart, Tooltip, } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Tooltip,);

const Dashboard = (props) => {

  useEffect(() => {
    props.getDashboardStats()
  }, [])

  let { total_jobs,
    platform_job_stats,
    total_leads,
    new_leads,
    contacted_leads,
    qualified_leads,
    lost_leads,
    closed_leads,
    leads_stats_0,
    leads_stats_1
  } = props.dashboardStats;

  let new_lead = {
    data: canvas => {

      return {
        labels: leads_stats_0 ? leads_stats_0.map(el => el.date) : [],
        datasets: [{
          label: "Today Leads",
          fill: true,
          // backgroundColor: gradientStroke,
          borderColor: "#40aaf4",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#40aaf4",
          pointBorderColor: "rgba(64,170,244,0)",
          pointHoverBackgroundColor: "#40aaf4",
          pointBorderWidth: 10,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: leads_stats_0 ? leads_stats_0.map(el => el.count) : []
        }]
      };
    },
    options: chart_options
  };

  let leads_stats_1_data = {
    data: canvas => {

      return {
        labels: leads_stats_1 ? leads_stats_1.map(el => el.date) : [],
        datasets: [{
          label: "Today Leads",
          fill: true,
          // backgroundColor: gradientStroke,
          borderColor: "#40aaf4",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#40aaf4",
          pointBorderColor: "rgba(64,170,244,0)",
          pointHoverBackgroundColor: "#40aaf4",
          pointBorderWidth: 10,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: leads_stats_1 ? leads_stats_1.map(el => el.count) : []
        }]
      };
    },
    options: chart_options
  };


  return (
    <div className="content">
      {total_jobs == 0
        ? <Card className="card-table loader-spinner"><Loader /></Card>
        : <div id="capture">
          <Row>
            <Col className="card-total" lg="3" md="6" xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h4">
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className='counter-start text-center' >
                    <CountUp end={new_leads}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span className='CountUp' ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    <p>New Leads</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="card-total" lg="3" md="6" xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h4">
                    {/* <div tag="h2" className='text-center'>Total Accounts</div> */}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className='counter-start text-center' >
                    <CountUp end={closed_leads}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span className='CountUp' ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    <p>Won Leads</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="card-total" lg="3" md="6" xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h4">
                    {/* <div tag="h2" className='text-center'>Total Jobs</div> */}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className='counter-start text-center' >
                    <CountUp end={total_jobs}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span className='CountUp' ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    <p>Total Leads</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="card-total" lg="3" md="6" xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h4">
                    {/* <div tag="h2" className='text-center'>HotLead Jobs</div> */}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className='counter-start text-center' >
                    <CountUp end={contacted_leads}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span className='CountUp' ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    <p>Contacted Leads</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                    <div tag="h2">All Leads of This Month</div>

                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={new_lead.data()}
                      options={new_lead.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="6" md="12" xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                    <div tag="h2">New Leads of this Month</div>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={leads_stats_1_data.data()}
                      options={leads_stats_1_data.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      }
    </div>
  );
}

const mapDispatchToProps = { getDashboardStats };

const mapStateToProps = ({ Auth }) => {
  let { dashboardStats } = Auth
  return { dashboardStats }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);


let chart_options = {
  maintainAspectRatio: false,
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: -1,
    position: "nearest"
  },
  responsive: true,
  scales: {
    yAxes: [{
      barPercentage: 0.9,
      gridLines: {
        drawBorder: false,
        color: "rgba(64, 170, 244, 0.0)",
        zeroLineColor: "transparent"
      },
      ticks: {
        beginAtZero: true,
        suggestedMin: 10,
        suggestedMax: 10,
        padding: 10,
        fontColor: "#9a9a9a"
      }
    }],
    xAxes: [{
      barPercentage: 0.6,
      gridLines: {
        drawBorder: false,
        color: "rgba(64, 170, 244, 0.1)",
        zeroLineColor: "transparent"
      },
      ticks: {
        padding: 10,
        fontColor: "#9a9a9a"
      }
    }]
  }
};

let donutOptions = {
  maintainAspectRatio: false,
  legend: {
    display: true
  },
  tooltip: {
    enabled: true // <-- this option disables tooltips
  },
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest"
  },
  responsive: true
};