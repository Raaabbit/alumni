import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const PAGE_SIZE = 10

const app = getApp()

Page({
  data: {
    isLoaded: false,
    filter: 2,
    list: null,
    pagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(
      () => {
        this.loadSquareCards()
        wxUtil.getNoticeCount().then(count => {
          if (count > 0) {
            wx.setTabBarBadge({
              index: 2,
              text: count.toString(),
            })
          } else {
            wx.removeTabBarBadge({
              index: 2,
            })
            // 检查消息订阅状态
            wxUtil.checkSubscribeStatus()
          }
        })
      },
    )
  },
  onPullDownRefresh() {
    this.loadSquareCards().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { current, total } = this.data.pagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadSquareCards(current + 1)
    }
  },
  onShareAppMessage() {
    return {
      title: 'SEU 校友人脉-加入东南大学校友圈，结识更多优秀校友',
      path: `/pages/connections/connections`
    }
  },
  loadSquareCards(pageNo = 1) {
    this.setData({
      isLoaded: false,
    })
    return Api.getSquareCards({
      filter: this.data.filter,
      pageSize: PAGE_SIZE,
      pageIndex: pageNo,
    }).then(res => {
      const { list, count } = res
      this.setData({
        isLoaded: true,
        list: pageNo === 1 ? list : this.data.list.concat(list),
        pagination: {
          current: pageNo,
          total: count,
        },
      })
    }, err => wxUtil.showToast(err.errMsg))
  },
  handleClickSearch() {
    wxUtil.navigateTo('search')
  },
  handleClickFilter(e) {
    const { filter } = e.target.dataset
    if (!isNaN(filter) && filter !== this.data.filter) {
      this.setData({ filter }, () => {
        this.loadSquareCards();
      })
    }
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('alumniDetail', { id })
  },
})
