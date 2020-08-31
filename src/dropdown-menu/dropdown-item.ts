import TComponent from '../common/component';

TComponent({
  properties: {
    title: {
      type: String,
      value: '',
    },
    options: {
      type: Array,
      value: [],
    },
    selectMode: {
      type: String,
      value: 'single',
    },
    optionsLayout: {
      type: String,
      value: 'columns',
    },
    optionsColumns: {
      type: [Number, String],
      value: 1,
    },
    showOverlay: {
      type: Boolean,
      value: true,
    },
    selected: {
      type: String,
      value: null,
    },
  },
  data: {
    prefix: 't',
    base: 't-dropdown-item',
    show: false,
    isBtnDisabled: true,
    bar: null,
    top: 0,
    contentClasses: '',
  },
  relations: {
    './dropdown-menu': {
      type: 'parent',
      linked(target) {
        console.log('child linked to ', target);
        this._getParentBottom(target);
        this.setData({
          bar: target,
        });
      },
    },
  },
  lifetimes: {
    attached() {
      const { selectMode } = this.data;
      const { optionsLayout } = this.data;
      const layoutCol = +this.data.optionsColumns;
      const isTree = optionsLayout === 'tree';
      const treeCol = +this.data.treeColumns;
      const prefix = 't';
      const contentClassesObj: Object = {
        [`${prefix}-is-tree`]: isTree,
        [`${prefix}-is-single`]: !isTree && selectMode === 'single',
        [`${prefix}-is-multi`]: !isTree && selectMode === 'multi',
        [`${prefix}-is-col1`]: layoutCol === 1 || treeCol === 1,
        [`${prefix}-is-col2`]: layoutCol === 2 || treeCol === 2,
        [`${prefix}-is-col3`]: layoutCol === 3 || treeCol === 3,
      };
      const contentClasses = Object.keys(contentClassesObj)
        .filter(e => contentClassesObj[e] === true)
        .join(' ');
      console.warn(contentClasses, layoutCol);
      this.setData({
        contentClasses,
      });
    },
  },
  methods: {
    _closeDropdown() {
      this.data.bar.setData({
        activeIdx: -1,
      });
      this.setData({
        show: false,
      });
    },
    _getParentBottom(parent) {
      const query = wx.createSelectorQuery().in(parent);
      query
        .select('#t-bar')
        .boundingClientRect((res) => {
          this.setData({
            top: res.bottom,
          });
        })
        .exec();
    },
    clickOverlay() {
      this._closeDropdown();
    },
    itemSelected(e) {
      this.setData({
        selected: e.currentTarget.dataset.value,
      });
      this._closeDropdown();
    },
  },
});
