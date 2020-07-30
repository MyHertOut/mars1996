<template>
  <div class="home-container">
    <div class="content">
      <img src="../assets/images/welcome.png" alt="welcome"/>
      <!-- <p class="info">decentralized application built on Settlity infrastructure</p>
      <p class="copyright">Trident © 2019. All Rights Reserved</p> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .home-container {
    width: 100%;
    // min-height: 100%;
    // height: 790px;
    height: calc(100vh - 60px - 200px);
    min-height: 656px;
    // min-height: 760px; //calc(100vh - 80px - 200px);
    background: url(../assets/images/home-bg.png) no-repeat;
    // background-size: 100% 100%;
    background-size: cover;
    overflow: auto;
    .content {
      width: 1200px;
      margin: 10% auto 0; // 10% 0 0 19%; // 230px 0 0 363px;
      color: #ffffff;
      img {
        width: 70%;
        // height: 90%;
      }
    }
    .info {
        margin: 22px 0 27px 0;
        font-size: 36px;
        letter-spacing: 2.9px;
    }
    .copyright {
      font-size: 18px;
      opacity: 0.6;
    }
  }
</style>
