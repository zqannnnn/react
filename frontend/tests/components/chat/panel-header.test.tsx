import * as React from 'react'
import { shallow, mount, render } from 'enzyme'
import { PanelHead } from '../../../src/components/chat/panel-header'

describe('Chat user item header', () => {
    it('render with user', () => {
        const onUserItemClose = () => {}
        const user = {name: 'name'}
        const wrap = shallow(
            <PanelHead onUserItemClose={onUserItemClose} user={user} userKey='userKey' text='' showClose={true} /> 
        )
        expect(wrap.text()).toEqual(user.name + '<Icon />')
    })

    it('render without user', () => {
        const onUserItemClose = () => {}
        const user = {name: 'name'}
        const wrap = shallow(
            <PanelHead onUserItemClose={onUserItemClose} user={user} userKey='userKey' text='panel' showClose={false} /> 
        )
        expect(wrap.text()).toEqual('panel')
    })
})