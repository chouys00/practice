import Vue from 'vue'
import Router from 'vue-router'
import StorePage from '@/components/StorePage'
import ShoppingCart from '@/components/ShoppingCart'
import AlertPage from '@/components/AlertPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      // name: 'StorePage',
      components: {
        a: StorePage,
        // a: StorePage,
        b: ShoppingCart,
        c: AlertPage
      }
    }

  ]
})
