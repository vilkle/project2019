import Vue from 'vue'

import {
    Autocomplete,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Cascader,
    Checkbox,
    CheckboxGroup,
    Col,
    Container,
    DatePicker,
    Dialog,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Form,
    Footer,
    FormItem,
    Header,
    Icon,
    Input,
    InputNumber,
    Loading,
    Main,
    Menu,
    MenuItem,
    MenuItemGroup,
    Message,
    MessageBox,
    Notification,
    Option,
    Pagination,
    Popover,
    Progress,
    Radio,
    RadioGroup,
    Row,
    Select,
    Submenu,
    Switch,
    Table,
    TableColumn,
    Tabs,
    TabPane,
    Tag,
    Tooltip,
    TimePicker,
    Upload,
    TimeSelect,
    ColorPicker,
    Steps,
    Step,
    Tree,
    RadioButton
} from 'element-ui'

const element = {
    install: function (Vue) {
        Vue.use(Autocomplete)
        Vue.use(Badge)
        Vue.use(Breadcrumb)
        Vue.use(BreadcrumbItem)
        Vue.use(Button)
        Vue.use(Card)
        Vue.use(ColorPicker)
        Vue.use(Cascader)
        Vue.use(Checkbox)
        Vue.use(CheckboxGroup)
        Vue.use(Col)
        Vue.use(Container)
        Vue.use(Pagination)
        Vue.use(DatePicker)
        Vue.use(Dropdown)
        Vue.use(DropdownItem)
        Vue.use(DropdownMenu)
        Vue.use(Form)
        Vue.use(Footer)
        Vue.use(FormItem)
        Vue.use(Icon)
        Vue.use(Input)
        Vue.use(InputNumber)
        Vue.use(Header)
        Vue.use(Main)
        Vue.use(Menu)
        Vue.use(MenuItem)
        Vue.use(MenuItemGroup)
        Vue.use(Option)
        Vue.use(Pagination)
        Vue.use(Popover)
        Vue.use(Progress)
        Vue.use(Radio)
        Vue.use(RadioGroup)
        Vue.use(Row)
        Vue.use(Select)
        Vue.use(Submenu)
        Vue.use(Switch)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(Tabs)
        Vue.use(TabPane)
        Vue.use(Tag)
        Vue.use(Tooltip)
        Vue.use(TimePicker)
        Vue.use(Tooltip)
        Vue.use(Upload)
        Vue.use(TimeSelect)
        Vue.use(Dialog)
        Vue.use(Steps)
        Vue.use(Step)
        Vue.use(Tree)
        Vue.use(Loading.directive)
        Vue.use(RadioButton)
    }
}

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$notify = Notification
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

export default element
