import * as React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { Layout } from 'antd'

import { configureStore } from '../../helpers/store'
import { history } from '../../helpers/history'
import { RootState } from '../../reducers'
import i18n from '../../helpers/i18n'

const initialState: RootState = {
  auth: {
    authInfo: {
      id: '4c251288-963c-4c6d-880b-25cc0ca6bacf',
      isAdmin: true,
      licenseStatus: 0,
      preferredCurrencyCode: 'USD',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRjMjUxMjg4LTk2M2MtNGM2ZC04ODBiLTI' +
        '1Y2MwY2E2YmFjZiIsInVzZXJUeXBlIjoxLCJwYXNzd29yZCI6IiQyYSQxMCQ2clpaQXNCWERDcUNocXd' +
        'vL29wWkoubEtRbGpXQ1VOLjdTY0JmY25WeHZlWTVHanlJMnVsMiIsImxpY2Vuc2VTdGF0dXMiOm51bGw' +
        'sInByZWZlcnJlZEN1cnJlbmN5Q29kZSI6bnVsbCwiaWF0IjoxNTMwNjk5OTU0LCJleHAiOjE1MzEzMDQ' +
        '3NTR9.3kCJZLsji-R_zKlp3WW2GYk8C2CaJYvOpAucxZjBp7M'
    },
    loggedIn: true
  },
  alert: {},
  admin: {},
  category: {},
  goods: {},
  currency: {
    currentCurrency: 'USD',
    loading: true,
    items: [
      {
        code: 'EUR',
        rate: 1,
        description: 'Euro'
      },
      {
        code: 'CNY',
        rate: 7.526251,
        description: 'Chinese Yuan'
      },
      {
        code: 'USD',
        rate: 1.175224,
        description: 'United States Dollar'
      },
      {
        code: 'GBP',
        rate: 0.882041,
        description: 'British Pound Sterling'
      },
      {
        code: 'JPY',
        rate: 129.999781,
        description: 'Japanese Yen'
      },
      {
        code: 'KRW',
        rate: 1272.615115,
        description: 'South Korean Won'
      },
      {
        code: 'BTC',
        rate: 0.0001821,
        description: 'BitCoin'
      },
      {
        code: 'ETH',
        rate: 0.002496,
        description: 'Ethereum'
      }
    ]
  },
  lightbox: {
    showing: false,
    images: [],
    currentIdx: 0
  },
  transaction: {
    items: [
      {
        createdAt: '2018-07-06T05:13:28.204Z',
        currencyCode: 'BTC',
        goodsId: '8da71249-32d7-4d05-a555-111c16ca3fba',
        id: '8e66f3fb-c308-45fc-a89f-f159118e399e',
        isMakerSeller: false,
        itemType: 'Transaction',
        makerId: 'bdae7e5e-e25a-45ec-9541-6ab77fdff0aa',
        price: 3,
        status: 1,
        takerId: undefined,
        updatedAt: '2018-07-06T05:13:28.204Z',
        goods: {
          address: undefined,
          bone: 'Bone Out',
          brand: 'test',
          breed: 'Hereford',
          category: 'Beef',
          certificates: [],
          createdAt: '2018-07-06T05:13:28.172Z',
          creatorId: 'bdae7e5e-e25a-45ec-9541-6ab77fdff0aa',
          deliveryTerm: 'sdf',
          desc: 'asd',
          factoryNum: '123',
          fed: undefined,
          grade: 'V',
          grainFedDays: undefined,
          id: '8da71249-32d7-4d05-a555-111c16ca3fba',
          ifExist: false,
          images: [
            {
              path: '/static/TVUTHtOs.png',
              type: 1
            }
          ],
          marbleScore: 2,
          ownerId: 'bdae7e5e-e25a-45ec-9541-6ab77fdff0aa',
          placeOfOrigin: undefined,
          primalCuts: 'tet',
          quantity: 4,
          slaughterSpec: 'Full set ex Trim',
          storage: 'Chilled',
          title: 'test sfs',
          trimmings: 3,
          updatedAt: '2018-07-06T05:13:28.172Z'
        }
      }
    ]
  },
  upload: {},
  user: {
    userData: {
      businessLicenses: [{ path: 'http://localhost:3000/static/jFRAMAkM.jpg' }],
      companyAddress: 'teseta',
      companyName: 'test',
      email: 'admin@admin.com',
      firstName: 'Louis',
      id: 'bdae7e5e-e25a-45ec-9541-6ab77fdff0aa',
      isActive: true,
      lastName: 'Liu',
      licenseStatus: 0,
      preferredCurrencyCode: undefined,
      resetKey: undefined,
      userType: 1
    }
  }
}
const store = configureStore(initialState)
export default class Wrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Layout>
            <Router history={history}>{this.props.children}</Router>
          </Layout>
        </I18nextProvider>
      </Provider>
    )
  }
}
