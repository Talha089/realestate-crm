import CountUp from 'react-countup';
import { connect } from 'react-redux';
import React, { useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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

  let { total_jobs, hotlead_jobs, total_users, total_tasks, job_stats,
    applied_job_stats, platform_job_stats } = props.dashboardStats;

  let new_jobs = {
    data: canvas => {
      // let ctx = canvas.getContext("2d");

      // let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      // gradientStroke.addColorStop(1, "rgba(64,170,244,0.5)");
      // gradientStroke.addColorStop(0.4, "rgba(64,170,244,0.0)");
      // gradientStroke.addColorStop(0, "rgba(64,170,244,0.2)"); //CPT PURPLE colors

      return {
        labels: job_stats ? job_stats.map(el => el.date) : [],
        datasets: [{
          label: "Today Jobs",
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
          data: job_stats ? job_stats.map(el => el.count) : []
        }]
      };
    },
    options: chart_options
  };

  let applied_job_stats_data = {
    data: canvas => {
      // let ctx = canvas.getContext("2d");

      // let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      // gradientStroke.addColorStop(1, "rgba(64,170,244,0.5)");
      // gradientStroke.addColorStop(0.4, "rgba(64,170,244,0.0)");
      // gradientStroke.addColorStop(0, "rgba(64,170,244,0.2)"); //CPT PURPLE colors

      return {
        labels: applied_job_stats ? applied_job_stats.map(el => el.date) : [],
        datasets: [{
          label: "Today Jobs",
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
          data: applied_job_stats ? applied_job_stats.map(el => el.count) : []
        }]
      };
    },
    options: chart_options
  };

  let totalJobs = {
    data: canvas => {
      // let ctx = canvas.getContext("2d");

      // let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      // gradientStroke.addColorStop(1, "rgba(64,170,244,0.5)");
      // gradientStroke.addColorStop(0.4, "rgba(64,170,244,0.0)");
      // gradientStroke.addColorStop(0, "rgba(64,170,244,0.2)"); //CPT PURPLE colors

      return {
        labels: platform_job_stats ? ['Linkedin', 'GlassDoor', 'Monster', 'Indeed'] : [],
        datasets: [{
          label: "Total Job Per Stack In a Day",
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
          data: platform_job_stats ?
            [platform_job_stats.Linkedin, platform_job_stats.GlassDoor, platform_job_stats.Monster, platform_job_stats.Indeed] : []
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
                    <CountUp end={total_tasks}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span className='CountUp' ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    <p>Campaigns</p>
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
                    <CountUp end={total_users}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span className='CountUp' ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    <p>Accounts</p>
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
                    <p>Total Jobs</p>
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
                    <CountUp end={hotlead_jobs}>
                      {({ countUpRef, start }) => (
                        <VisibilitySensor onChange={start} delayedCall>
                          <span className='CountUp' ref={countUpRef} />
                        </VisibilitySensor>
                      )}
                    </CountUp>
                    <p>Hot Leads</p>
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
                    <div tag="h2">Fetched Jobs</div>
                    <div className='row'>
                      <i className="tim-icons icon-notes mx-3" />
                      <h4 className="card-category mx-2">Fetched Jobs: {total_jobs}</h4>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={new_jobs.data()}
                      options={new_jobs.options}
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
                    <div tag="h2">Total Apply’s Per Day</div>
                    <div className='row'>
                      <i className="tim-icons icon-notes mx-3" />
                      <h4 className="card-category mx-2">Applied Jobs: {applied_job_stats ? applied_job_stats.length : 0}</h4>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={applied_job_stats_data.data()}
                      options={applied_job_stats_data.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" md="12" xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                    <div tag="h2">Jobs By Platform</div>
                    <div className='row'>
                      <i className="tim-icons icon-notes mx-3" />
                      <h4 className="card-category mx-2">Total Jobs: {total_jobs}</h4>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Bar
                      data={totalJobs.data()}
                      options={totalJobs.options}
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
      barPercentage: 0.6,
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