<template>
  <div id="app">
    <div class="container col-md-4">
      <div class="row">
        <div class="col-md-12 main">
          <nav class="navbar navbar-expand-lg navbar-light custom-bg">
            <router-link class="navbar-brand brand_href" :to="{name: 'index'}">
              Leveler
            </router-link>
            <ul class="navbar-nav custom-right">
              <li class="nav-item">
                <router-link class="nav-link new_link" :to="{name: 'instruction'}">
                  Инструкция
                </router-link>
              </li>
            </ul>
          </nav>
          <div class="html-content">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-12 footer_text">
          <b>Leveler</b> &copy; {{ new Date().getFullYear() }} | <b>Поддержка:</b>
          <a href="https://vk.me/open_lvler" class="text-decoration-none" target="_blank">
            <i class="fab fa-vk"></i> Leveler
          </a>
          | <b>Исходный код:</b>
          <a href="https://github.com/lvler/lvler.github.io" class="text-decoration-none" target="_blank">
            <i class="fab fa-github"></i> Leveler
          </a>
          <br>
          <small>
            Версия: <b>{{ packageJson.version }}</b>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import packageJson from '../package.json';

export default {
  data: function () {
    return {
      packageJson
    };
  },
  mounted() {
    require('bootstrap');
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Nunito');
@import '~/../bootstrap/dist/css/bootstrap.css';
@import url('https://use.fontawesome.com/releases/v5.3.1/css/all.css');

@font-face {
  font-family: 'Tahoma';
  font-style: normal;
  font-display: swap;
}

.custom-bg {
  background: #4a76a8;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.brand_href:active {
  position: relative;
  top: 1px;
}

.navbar-brand, .new_link {
  color: #fff !important;
  font-weight: 600;
}

.main {
  padding: 0;
}

.html-content {
  padding: 15px 20px;
  max-width: 90%;
  margin: 0 auto;
  border-left: 1px solid #d7e4f9;
  border-right: 1px solid #d7e4f9;
  border-bottom: 1px solid #d7e4f9;
  border-radius: 0 0 10px 10px;
}

.nav-item {
  color: #fff;
  padding: 0 15px;
}

.nav-item:active {
  position: relative;
  top: 1px;
}

.nav-item:hover {
  background: #3d6898;
  border-radius: 5px;
}

.footer_text {
  text-align: center;
  color: #aeaeae;
  font-size: 15px;
  margin: 15px 0;
}

td, th {
  text-align: center;
}

button.navbar-toggler {
  outline: none;
}

.btn {
  font-weight: 600;
}

.navbar-light .navbar-toggler {
  color: #fff;
  border-color: #fff;
}

.navbar-light .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(255,255,255,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.icon_td {
  padding-top: 20px !important;
}

.cursor_pointer {
  cursor: pointer;
}

.disable {
  pointer-events: none;
  cursor: none;
  opacity: 0.25;
}

.custom-right {
  position: absolute;
  right: 10px;
}

@media screen and (max-width: 991px) {
  .html-content {
    max-width: 100%;
    padding: 15px 5px;
    border: 0;
  }
  .card-body {
    padding: 5px;
  }
}

@media screen and (max-width: 575px) {
  .custom-bg {
    border-radius: 0;
  }
}

@media screen and (max-width: 353px) {
  .custom-bg {
    border-radius: 0;
  }
  .btn-space {
    margin-top: 10px;
  }
}
</style>
