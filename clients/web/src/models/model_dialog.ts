import { ModuleStore, doAction } from "module-reaction";

export const MODULE_DIALOG = 'MODULE_DIALOG'
export interface ModelDialog extends ModuleStore {
    visible: boolean
    title: string
    text: string
    onOk?: () => void,
    onCancel?: () => void
    showLoading: boolean
}

export const model_dialog: ModelDialog = {
    module: MODULE_DIALOG,
    visible: false,
    showLoading: false,
    title: '',
    text: ''
}

export const close_dialog = () => {
    doAction(MODULE_DIALOG, { visible: false, showLoading: false })
}