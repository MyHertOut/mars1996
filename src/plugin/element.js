import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

import {
  Button,
  Input,
  Select,
  Option,
  Table,
  Pagination,
  Menu,
  Row,
  Col,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Breadcrumb,
  BreadcrumbItem,
  TableColumn,
  Loading,
  Steps,
  Step,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  Checkbox,
  Dialog,
  Message,
  DatePicker,
  Progress,
  Popover,
  Image,
  Tooltip,
  Notification
} from 'element-ui';

const elements = {
  install (Vue) {
    locale.use(lang);

    Vue.use(Button);
    Vue.use(Input);
    Vue.use(Table);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Menu);
    Vue.use(Pagination);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(Dropdown);
    Vue.use(DropdownItem);
    Vue.use(DropdownMenu);
    Vue.use(Breadcrumb);
    Vue.use(BreadcrumbItem);
    Vue.use(TableColumn);
    Vue.use(Steps);
    Vue.use(Step);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Radio);
    Vue.use(Checkbox);
    Vue.use(RadioGroup);
    Vue.use(Dialog);
    Vue.use(DatePicker);
    Vue.use(Progress);
    Vue.use(Popover);
    Vue.use(Loading.directive);
    Vue.use(Image);
    Vue.use(Tooltip);
    Vue.prototype.$message = Message;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$loading = Loading.service;
  }
};

export default elements;
