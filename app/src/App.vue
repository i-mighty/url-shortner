<template>
  <div id="app">
    <div id="nav">
      <h2 class="title">URLShortner</h2>
      <div class="form">
        <template v-if="formLoading">
          <p id="form-loading">Shortening Url, please wait ...</p>  
        </template>
        <template v-else>
          <form id="new-url-form" @submit.prevent="shortenURL">
            <input placeholder="Enter URL to shorten" type="text" name="originalUrl" v-model="originalUrl"/>
            <button type="submit">Submit</button>
          </form>
        </template>
      </div>
    </div> 
    <div id="body">
      <template v-if="loading">
        <p id="content-loading">Loading URLs ...</p>  
      </template>
      <template v-else>
        <div id="content">
          <template v-if="urls.length">
            <div id="table-view">
              <h3>List of shortened URLs</h3>
              <table id="urls">
                <tr>
                  <th>Original URL</th>
                  <th>Short URL</th>
                </tr>
                <tr v-for="row in urls" v-bind:key="row._id" v-bind:id="row._id">
                  <td :id="`original-url${row._id}`">{{ row.originalUrl }}</td>
                  <td :id="`original-url${row._id}`">{{ row.shortUrl }}</td>
                </tr>
              </table>
              <b class="table-info">
                {{
                  `showing entry ${((page-1)*limit)+1} to ${((page-1)*limit)+urls.length} of ${total}`
                }}
              </b>
            </div>
          </template>
          <template v-else>
            <div id="no-data">
              <b>
                No urls have been shortened yet
              </b>
            </div>
          </template>
        </div>
      </template>
      <template v-if="pages > 1">
        <div class="pagination">
          <template v-if="page > 1">
            <button id="prev" @click="decrementPages">Prev</button>
          </template>
          <template v-if="page < pages">
            <button id="next" @click="incrementPages">Next</button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios';

  const baseUrl = process.env.VUE_APP_SERVER_URL;

export default  Vue.extend({ 
    data: function (){
      return {
        loading: false,
        formLoading: false,
        page: 1,
        pages: 0,
        limit: 10,
        total: 0,
        urls: [],
        originalUrl: ''
      }
    },
    created: function() {
      this.getUrlList()
    },
    methods: {
      getUrlList() {
        const {limit, page} = this;
        this.loading = true
        axios.post(`${baseUrl}/urls`, {
          limit,
          page
        })
        .then(response => {
          this.loading = false
          this.urls = response.data.data.docs;
          this.pages = response.data.data.pages;
          this.total = response.data.data.total;
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
      },
      shortenURL(){
        const {originalUrl} = this;
        this.formLoading = true;
        axios.post(`${baseUrl}/url`, {originalUrl})
        .then(response => {
          alert(`Url shortened successfully`);
          this.formLoading = false;
          this.originalUrl = '';
          this.getUrlList();
        })
        .catch(error => {
          alert(`Couldn't shorten URL. Try again.`);
          this.formLoading = false;
          console.log(`error`);
        })
      },
      incrementPages() {
        this.page++;
        this.getUrlList();
      },
      decrementPages() {
        this.page--;
        this.getUrlList();
      }
    }
  })
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
  }

  #nav {
    padding: 10px 30px;
    display: flex;
    justify-content: space-between;
    background-color: #2c3e50;
  }

  .title, #form-loading {
    color: aliceblue;
  }

  .form, form{
    display: flex;
    justify-content: center;
    height: 50px;
  }

  #body{
    padding: 20px 0px;
  }

  #urls {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  #urls td {
    text-align: left;
  }

  #urls td, #urls th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  #urls tr:nth-child(even){background-color: #f2f2f2;}

  #urls tr:hover {background-color: #ddd;}

  #urls th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #4CAF50;
    color: white;
  }

  .table-info{
    font-size: 14px;
  }

  .pagination {
    justify-content: flex-end;
    align-items: flex-end;
    margin: 10px;
  }
  .pagination > button{
    padding: 10px;
    font-size: 14px;
  }
  </style>
