import { Comment } from '../models'

function _initDomTreeObject(ary: Array<Comment>, commentDeta?: Array<Comment>) {
  let comment = commentDeta
    ? commentDeta
    : (function(ary) {
        let tempAry = []
        let idList: string[] = []
        ary.forEach(function(item) {
          item.id && idList.push(item.id)
        })
        for (let i = 0, len = ary.length; i < len; i++) {
          if (
            ary[i].replyTo == undefined ||
            (typeof ary[i].replyTo !== undefined && deb(idList, ary[i].replyTo))
          ) {
            let obj = ary[i]
            tempAry.push(obj)
            console.log(ary[i])
            console.log(len, ary.length)
          }
        }
        console.log(tempAry)
        console.log(idList)
        return tempAry
      })(ary)

  function deb(idList: string[], id?: string) {
    let flag = true
    for (let ida in idList) {
      if (id == idList[ida]) {
        flag = false
      }
    }
    console.log(flag)
    return flag
  }
  function getParentNode(ary: Array<Comment>, id?: string) {
    let parentNode
    ary.forEach(function(item) {
      if (item.id == id) {
        parentNode = item
        return false
      }
    })
    console.log(parentNode)
    return parentNode
  }

  function getLevelOnTheTree(ary: Array<Comment>, dataItem?: Comment) {
    let idList: string[] = []
    ary.forEach(function(item) {
      item.id && idList.push(item.id)
    })
    let level = 1
    while (!deb(idList, dataItem && dataItem.replyTo)) {
      dataItem = getParentNode(ary, dataItem && dataItem.replyTo)
      level++
    }
    console.log(level)
    return level
  }

  let temp = 0
  if (comment.constructor == Array) {
    for (let i = 0, len = comment.length; i < len; i++) {
      for (let j = 0, lenA = ary.length; j < lenA; j++) {
        if (ary[j].replyTo == comment[i].id) {
          let obj = ary[j]
          let newReplys = comment[i].replys || []
          newReplys.unshift(obj)
          comment[i].replys = newReplys
          temp++
          console.log(comment[i])
          console.log(ary[j])
          console.log(newReplys)
          console.log(len, comment.length, lenA, ary.length)
        }
      }
    }
  }

  if (comment.constructor == Array) {
    for (let n = 0, lenB = comment.length; n < lenB; n++) {
      comment[n].levelOnTheTree = getLevelOnTheTree(ary, comment[n])
      console.log(comment[n])
      console.log(lenB, comment.length)
      if (temp > 0) {
        console.log(temp)
        let oldReplys = comment[n].replys ? comment[n].replys : []
        let newReplys = _initDomTreeObject(ary, oldReplys)
        console.log(oldReplys)
        console.log(newReplys)
        if (newReplys.length == 0) {
          delete comment[n].replys
        }
      }
    }
  }

  return comment
}

export { _initDomTreeObject }
