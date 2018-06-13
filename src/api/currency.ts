import fetch from 'node-fetch'
import { accessKey, symbols } from '../config/static'
import { Currency } from '../models/'

const getApi = async () => {
  let dataList: any
  let dataSymbolsList: any
  await fetch(
    'http://data.fixer.io/api/symbols?access_key=db7b00b340d9275681a88e2398428a37'
  )
    .then(resSymbols => resSymbols.json())
    .then(dataSymbols => {
      if (dataSymbols.success) {
        dataSymbols.symbols.BTC = 'BitCoin'
        dataSymbols.symbols.ETH = 'Ethereum'
        dataSymbolsList = dataSymbols
      }
    })
  fetchRate(dataList, dataSymbolsList)
  setInterval(() => {
    fetchRate(dataList, dataSymbolsList)
  }, 1000 * 60 * 60)
}
const fetchRate = async (dataList: any, dataSymbolsList: any) => {
  await fetch(
    'http://data.fixer.io/api/latest?access_key=' +
      accessKey +
      '&base=EUR&symbols=' +
      symbols.join(',')
  )
    .then(res => res.json())
    .then(data => {
      dataList = data
    })
  fetch(
    'https://min-api.cryptocompare.com/data/pricemulti?fsyms=EUR&tsyms=BTC,ETH'
  )
    .then(resBE => resBE.json())
    .then(dataBE => {
      if (dataList.success) {
        dataList.rates.BTC = dataBE.EUR.BTC
        dataList.rates.ETH = dataBE.EUR.ETH
        dataList.symbols = null
        if (dataSymbolsList) {
          dataList.symbols = dataSymbolsList.symbols
        }
        add(dataList.rates, dataList.symbols)
      }
    })
}
interface IObject {
  [key: string]: number
}
const add = async (data: IObject, symbol: IObject) => {
  for (const code in data) {
    if (data.hasOwnProperty(code)) {
      const currency = await Currency.find({ where: { code } })
      if (!currency) {
        const currencyDb = new Currency({
          code,
          description: symbol ? symbol[code] : '',
          rate: data[code]
        })
        currencyDb.save()
      } else {
        currency.rate = data[code]
        currency.save()
      }
    }
  }
}

export { getApi }
