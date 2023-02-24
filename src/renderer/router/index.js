import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Container',
      name: 'Container',
      component: require('@/components/Container').default,
      children: [
        {
          path: 'InsertPatientViewer',
          name: 'InsertPatientViewer',
          component: require('@/components/InsertPatientViewer').default,
        },
        {
          path: 'PatientsViewer',
          name: 'PatientsViewer',
          component: require('@/components/PatientsViewer').default,
        },
        {
          path: 'WeightViewer',
          name: 'WeightViewer',
          component: require('@/components/WeightViewer').default,
        },
        {
          path: 'BedViewer',
          name: 'BedViewer',
          component: require('@/components/BedViewer').default,
        },
        {
          path: 'BMIViewer',
          name: 'BMIViewer',
          component: require('@/components/BMIViewer').default,
        },
        {
          path: 'TemperatureViewer',
          name: 'TemperatureViewer',
          component: require('@/components/TemperatureViewer').default,
        }
        ]
    },
    {
      path: '*',
      redirect: '/Container/InsertPatientViewer'
    }
  ]
})
