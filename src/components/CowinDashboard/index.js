// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const appConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {appStatus: appConstants.initial, resultObject: {}}

  componentDidMount() {
    this.getDeatils()
  }

  getDeatils = async () => {
    const URL = 'https://apis.ccbp.in/covid-vaccination-data'
    // eslint-disable-next-line no-unused-vars
    const options = {
      method: 'GET',
      body: JSON.stringify(),
    }
    const response = await fetch(URL)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      const {last7DaysVaccination} = fetchedData
      const newLast7DaysVaccination = last7DaysVaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      fetchedData.last7DaysVaccination = [...newLast7DaysVaccination]
      this.setState({
        appStatus: appConstants.success,
        resultObject: fetchedData,
      })
    } else {
      this.setState({appStatus: appConstants.failure})
    }
  }

  renderSuccess = () => {
    const {resultObject} = this.state
    return (
      <>
        <VaccinationCoverage resultObject={resultObject} />
        <VaccinationByGender resultObject={resultObject} />
        <VaccinationByAge resultObject={resultObject} />
      </>
    )
  }

  renderFailure = () => (
    <div className="failureView">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      />
      <p>Something went wrong</p>
    </div>
  )

  appState = () => {
    const {appStatus} = this.state
    switch (appStatus) {
      case appConstants.success:
        return this.renderSuccess()
      case appConstants.failure:
        return this.renderFailure()
      case appConstants.initial:
        return (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-cont">
        <div className="head">
          <img
            className="logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <h1 className="heading">Co-WIN</h1>
        </div>
        <p className="des">CoWIN Vaccination in India</p>
        {this.appState()}
      </div>
    )
  }
}
export default CowinDashboard
