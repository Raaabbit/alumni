import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import {
  GENDER_TYPE, DEGREE_TYPE,
  BASIC_FIELD, EDUCATION_FIELD, WORK_FIELD, COLLEGE_TYPE
} from '../../macros'

const app = getApp()

Page({
  data: {
    isLoaded: false,
    genderSelect: GENDER_TYPE,
    degreeSelect: DEGREE_TYPE,
    collegeSelect: COLLEGE_TYPE,
    account: {},
    education: {
      school: '东南大学'
    },
    job: {},
    redirect: '', // 完善后跳转的路径
    options: '', // 完善后跳转的路径参数
    showTipComponent: false,
  },
  onLoad(option) {
    const { redirect = 'mine', options = '{}' } = option
    this.setData({
      redirect,
      options: decodeURIComponent(options),
    })
    // 登录
    wxUtil.login().then(
      () => {
        // 获取用户信息
        Api.getAccountAll({
          accountId: app.global.accountId,
        }).then(
          data => {
            const { account } = data
            account.gender = Number(account.gender)
            // 处理时间
            account.birthday = Util.getYearMonthDate(account.birthday)
            // 处理性别
            account.gender = R.findIndex(R.propEq('id', account.gender), GENDER_TYPE)

            this.setData({
              isLoaded: true,
              account,
            })
          },
          () => {},
        )
      },
    )
  },
  onShow(){
    wx.hideHomeButton();
  },
  handleClickAvatar() {
    Util.promisify(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        'account.avatar': res.tempFilePaths.pop(),
      })
    })
  },
  // 定位
  handleLocation() {
    wxUtil.getLocation().then(res => {
      if (!res) {
        wxUtil.showToast('没有定位到')
        return
      }
      this.setData({ 'account.city': res })
    }, err => {
      Util.promisify(wx.showModal)({
        title: '错误提示',
        content: err.errMsg,
        confirmText: '关闭',
        confirmColor: '#2180E8',
        showCancel: false,
      })
    })
  },
  handleInputChange(e) {
    const { name } = e.currentTarget.dataset
    this.setData({
      [name]: e.detail.value,
    })
  },
  handlePhoneCheck (e) {
    const phone = e.detail.value
    if (phone.length !== 11 || !(/^[0-9]+$/.test(phone))) {
      wxUtil.showToast('手机号码格式不正确, 请尝试重新输入', 'none')
      this.setData({
        'account.phone' : '',
      })
    }
  },
  handleSave() {
    let account = R.clone(this.data.account)
    let education = R.clone(this.data.education)
    let job = R.clone(this.data.job)
    // 处理性别
    account.gender = GENDER_TYPE[account.gender].id
    // 处理学历
    const degree = DEGREE_TYPE[education.education] || {}
    education.education = degree.name
    // 处理学院
    const college = COLLEGE_TYPE[education.college] || {}
    education.college = college.name
    // 必填项判断
    account = Util.checkParams(BASIC_FIELD, account)
    if (R.isEmpty(account)) return

    education = Util.checkParams(EDUCATION_FIELD, education)
    if (R.isEmpty(education)) return
    education.accountId = app.global.accountId

    // type: true-职场 false-学生
    if (account.type) {
      job = Util.checkParams(WORK_FIELD, job)
      if (R.isEmpty(job)) return
      job.accountId = app.global.accountId
    }
    // 申请授权
    this.setData({
      showTipComponent: true,
    })
    // 订阅消息
    wxUtil.requestSubscribeMessage().then(flag => {
      this.setData({
        showTipComponent: false,
      })
    })
    Api.completeCard({
      account,
      educations: [education],
      jobs: account.type ? [job] : [],
    }).then(() => {
      app.setConfig({ registered: true })
      wxUtil.showToast('保存成功', 'success').then(() => {
        const { redirect, options } = this.data
        wxUtil.navigateTo(redirect, JSON.parse(options), true)
      })
    }, err => {
      Util.promisify(wx.showModal)({
        title: '错误提示',
        content: JSON.stringify(err),
        confirmText: '关闭',
        confirmColor: '#2180E8',
        showCancel: false,
      })
    })
  },
})
