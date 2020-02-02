import Vue from 'vue'

import {
  NavBar, Cell, Button,
  Toast, Dialog, Icon, Lazyload,
  Image, Loading, CellGroup, Popup, Divider,
  ActionSheet, Panel, CountDown, Stepper,
  Tab, Tabs, Tag, Sticky, Field, PullRefresh,
  Checkbox, Row, NoticeBar, SwipeCell,
  List, Search
} from 'vant'

Vue
  .use(Search)
  .use(List)
  .use(SwipeCell)
  .use(NoticeBar)
  .use(Row)
  .use(Checkbox)
  .use(PullRefresh)
  .use(Field)
  .use(Sticky)
  .use(ActionSheet)
  .use(Panel)
  .use(CountDown)
  .use(Stepper)
  .use(Tab)
  .use(Tabs)
  .use(Tag)
  .use(NavBar)
  .use(Toast)
  .use(Dialog)
  .use(Cell)
  .use(Button)
  .use(Icon)
  .use(Lazyload)
  .use(Image)
  .use(Loading)
  .use(CellGroup)
  .use(Popup)
  .use(Divider)
