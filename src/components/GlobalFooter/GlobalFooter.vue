/**
* 公共底栏
* Date: 2020/5/13
* Time: 12:27 上午
*/
<template>
  <div class="footer">
    <!--    <div class="links">-->
    <!--      <a href="link"></a>-->
    <!--    </div>-->
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> {{year}} <span>晶铸生物</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'GlobalFooter',
  data () {
    return {year:moment().format('YYYY')}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
