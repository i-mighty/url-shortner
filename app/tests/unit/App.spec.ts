import { shallowMount } from "@vue/test-utils";
import axios from 'axios';
import App from "@/App.vue";
import urls from '../urls.json'
import { config } from "@vue/test-utils";
config.showDeprecationWarnings = false;


const getUrlList = jest.fn();
const shortenURL = jest.fn();

jest.mock("axios", () => ({
  post: jest.fn(() =>  new Promise<string>(() => 'success'))
}));

const defaultPropsValue = {
  loading: false,
  formLoading: false,
  page: 1,
  pages: 0,
  limit: 10,
  total: 0,
  urls: [],
  originalUrl: "",
};

const methods = {
  getUrlList,
  shortenURL,
};

const defaultProps = {
  data: function() {
    return {
      ...defaultPropsValue
    };
  },
  methods
};

const formLoadingProps = {
  data: function() {
    return {
      ...defaultPropsValue,
      formLoading: true,
    }
  },
  methods,
}

const urlLoadingProps = {
  data: function() {
    return {
      ...defaultPropsValue,
      loading: true
    }
  },
  methods
}

const paginationProps = {
  data: function() {
    return {
      ...defaultPropsValue,
      page: 3,
      pages: 5,
      limit: 10
    };
  },
  methods
};

const tableProps = {
  data: function() {
    return {
      ...defaultPropsValue,
      age: 3,
      pages: 5,
      limit: 10,
      urls,
    };
  },
  methods
};


const mountFactory = (props: object) => {
  const wrapper =  shallowMount(App, props);
  return wrapper;
}

describe("App.vue", () => {
  it('renders the component properly', () => {
    const wrapper = mountFactory(defaultProps);
    expect(wrapper.find("#nav").exists()).toBeTruthy();
    expect(wrapper.find("#body").exists()).toBeTruthy();
    expect(methods.getUrlList).toBeCalledTimes(1);
  })
  
  it('renders the nav loading correctly', () => {
    const wrapper = mountFactory(formLoadingProps);
    expect(wrapper.find("#form-loading").exists()).toBeTruthy();
    expect(wrapper.find("#new-url-form").exists()).toBeFalsy();
  })

  it('renders the table loading correctly', () => {
    const wrapper = mountFactory(urlLoadingProps);
    expect(wrapper.find("#content-loading").exists()).toBeTruthy();
    expect(wrapper.find("#content").exists()).toBeFalsy();
  })

  it('renders table view', () => {
    const wrapper = mountFactory(tableProps);
    expect(wrapper.find('#content').exists()).toBeTruthy();
    expect(wrapper.find("#table-view").exists()).toBeTruthy();
  });

  it('renders complete table row', () => {
    const wrapper = mountFactory(tableProps);
    const row = wrapper.findAll('tr > td');
    expect(row.length).toBe(20);
    expect(row.exists()).toBeTruthy(); 
  });

  it('renders pagination section ', () => {
    const wrapper = mountFactory(paginationProps);
    expect(wrapper.find(".pagination").exists()).toBeTruthy();
    expect(wrapper.find("#prev").exists()).toBeTruthy();
    expect(wrapper.find("#next").exists()).toBeTruthy();
  });

  it("navigates pagination section ", () => {
    const wrapper = mountFactory(paginationProps);
    const page = wrapper.vm.$data.page;
    const prev = wrapper.find('#prev');
    const next = wrapper.find('#next');
    prev.trigger("click");
    expect(wrapper.vm.$data.page).toBe(page - 1);
    next.trigger('click');
    expect(wrapper.vm.$data.page).toBe(page);
  });  
});
