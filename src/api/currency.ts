const cronJob = require('cron').CronJob
import fetch from 'node-fetch'
import { accessKey , symbols} from '../config/static'
import { Currency} from '../models/'

const getApi = async () => {
  try {
    let dataList: any
    let dataSymbolsList: any
    await fetch('http://data.fixer.io/api/symbols?access_key=db7b00b340d9275681a88e2398428a37')
            .then(resSymbols => resSymbols.json())
            .then(dataSymbols => {
              if (dataSymbols.success) {
                dataSymbols.symbols.BTC = 'BitCoin'
                dataSymbols.symbols.ETH = 'Ethereum'
                dataSymbolsList = dataSymbols
              }
        })
    new cronJob('*/59 * * * *', async () => {
      //* * 1 * * *
      //http://data.fixer.io/api/latest?access_key=db7b00b340d9275681a88e2398428a37&base=EUR&symbols=USD,AOA
      //http://data.fixer.io/api/symbols?access_key=db7b00b340d9275681a88e2398428a37
        await fetch('http://data.fixer.io/api/latest?access_key=' + access_key + '&base=EUR&symbols=' + symbols.join(',')).then(res => res.json())
              .then(data => {
              dataList = data

              })
        // Request virtual currency
        fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=EUR').then(resBE => resBE.json())
                .then(dataBE => {
                  if (dataList.success) {
                    dataList.rates.BTC = dataBE.BTC.EUR
                    dataList.rates.ETH = dataBE.ETH.EUR
                    dataList.symbols = null
                    if (dataSymbolsList) {
                      dataList.symbols = dataSymbolsList.symbols
                    }
                    add(dataList.rates, dataList.symbols)

                  }
                })

    }, null, true, 'Asia/Chongqing')
  } catch (e) {
    console.log(e.message)
  }

}
interface IObject {
  [key: string]: number
}
//add
const add = async (data: IObject, symbols: IObject) => {
  try {

    for (const code in data) {
      const currency = await Currency.find({ where: { code } })
      if (!currency) {
        const currencyDb = new Currency({
          code,
          description: symbols ? symbols[code] : '',
          rate: data[code]
        })
        currencyDb.save()
      } else {
        currency.rate = data[code]
        currency.save()
      }
    }
  } catch (e) {
    console.log(e.message)
  }

}

export {getApi}
