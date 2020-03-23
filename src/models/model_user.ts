import { ModuleStore, ModuleAction, KV, plusAction } from "module-reaction";
import { Net } from "../utils/utils";
import { router_sign_in, router_user_detail } from "../utils/enum";
import { message } from "antd";

export interface User {
    id: string
    email: string
    username: string
    avatar: Doc
    country: string

    location: { coordinates: number[] }
    last_successful_login_time: string // date
    last_failed_login_time: string // date
    profile: {
        gender: string
        date_of_birth: string// date string
        // Height is xx Feet, xx Inches
        height: {
            feet: number
            inches: number
        }
        // Unit = Pounds
        weight: number
        ethnicity: string
        education_level: string
        marital: string
        employment: string
        year_of_starting_use_cannabis: number
        use_cannabis_frequency: string
        need_reset_password: boolean
        reset_password_expire: string // date
        banned: boolean
    },
    profile_progress: number
}
export interface ModleUser extends ModuleStore {
    logined: boolean
    list: User[] // current result for show
    total: number // total num of current search
    searchKey: string // search keyword
    pageSize: number // when fetch, pageSize=limit
    pageIdx: number //start with 0, when fetch, skip=pageSize * pageIdx
    curTab: 'active' | 'banned'
}
export const MODULE_USER = 'MODULE_USER'
export const modle_user: ModleUser = {
    module: MODULE_USER,
    logined: false,
    list: [],
    total: 0,
    searchKey: '',
    pageIdx: 1,
    pageSize: 10,
    curTab: 'active'
}

export const LoginWithTokenAction: ModuleAction<any, ModleUser> = {
    module: MODULE_USER,
    process: async (history: any, module: ModleUser) => {
        if (module.logined) {
            return {}
        }
        const res = await Net.req('/user/signin-with-token')
        if (res?.jwt_token) {
            history.push(router_user_detail)
            return {
                logined: true
            }
        } else {
            history.push(router_sign_in)
        }
        return {}
    }
}

export const FetchUsersAction: ModuleAction<KV, ModleUser> = {
    module: MODULE_USER,
    process: async (payload: KV, model: ModleUser) => {
        const { curTab, searchKey, pageSize, pageIdx } = Object.assign({}, model, payload)

        const res = await Net.req('/user/admin-search',
            {
                banned: curTab === 'banned',
                search_key: searchKey,
                limit: pageSize,
                skip: pageSize * (pageIdx - 1)
            }, 'get')
        if (res.list && res.list.length) {
            return {
                list: res.list,
                total: res.total,
                searchKey,
                pageSize,
                pageIdx
            }
        }
        message.info('has no more results')
        return {list: [], total: 0}
    }
}

export const ChgBanUsersAction: ModuleAction<KV, ModleUser> = {
    module: MODULE_USER,
    process: async (payload: KV, moduleStore: ModleUser) => {
        const { users } = payload
        const mode = moduleStore.curTab === 'active' ? 'ban' : 'unban'
        const res = await Net.req('/user/admin-ban-user', { users, mode }, 'post')
        if (res?.message === 'success') {
            plusAction(FetchUsersAction) // fresh curtab's users
        }
        return {}
    }
}