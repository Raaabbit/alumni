Component({
  options: {
    multipleSlots: true, // 启用多slot支持
    addGlobalClass: true
  },
  properties: {
    tabs: {
      type: Array,
      value: []
    },
  },
  data: {
    currentTab: 0
  },
  methods: {
    //滑动切换
    handleSwiperTab(e) {
      if (e.detail.source === 'touch') {
        this.setData({
          currentTab: e.detail.current
        });
      }
    },
    //点击切换
    handleClickTab(e) {
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        this.setData({
          currentTab: e.target.dataset.current
        })
      }
    }
  }
})