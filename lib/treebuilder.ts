import { omit, functions } from 'lodash'
import { FabrixApp } from '@fabrix/fabrix'

export const TreeBuilder = {

  getSpoolTree (spools) {
    return {
      label: 'Spools',
      nodes: Object.keys(omit(spools, 'inspect'))
    }
  },

  getApiTree (api) {
    return {
      label: 'API',
      nodes: [
        TreeBuilder.getControllerTree(api.controllers),
        TreeBuilder.getServiceTree(api.services),
        {label: 'Models', nodes: Object.keys(omit(api.models, 'inspect'))},
        {label: 'Policies', nodes: Object.keys(omit(api.policies, 'inspect'))}
      ]
    }
  },

  getModelTree (models: FabrixApp['api']['models']) {
    return {
      label: 'Models',
      nodes: omit(models, 'inspect').map((model, modelName) => {
        return {
          label: modelName,
          nodes: Object.keys(model.attributes)
        }
      })
    }
  },

  getResolverTree (resolvers: FabrixApp['api']['resolvers']) {
    return {
      label: 'Resolvers',
      nodes: omit(resolvers, 'inspect').map((resolver, resolverName) => {
        return {
          label: resolverName,
          nodes: Object.keys(resolver.attributes)
        }
      })
    }
  },

  getPoliciesTree (policies: FabrixApp['api']['policies']) {
    return Object.keys(omit(policies, 'inspect'))
  },

  getControllerTree (controllers: FabrixApp['api']['controllers']) {
    return {
      label: 'Controllers',
      nodes: omit(controllers, 'inspect').map((controller, controllerName) => {
        return {
          label: controllerName,
          nodes: functions(controller)
        }
      })
    }
  },

  getServiceTree (services: FabrixApp['api']['services']) {
    return {
      label: 'Services',
      nodes: omit(services, 'inspect').map((service, serviceName) => {
        return {
          label: serviceName,
          nodes: functions(service)
        }
      })
    }
  },

  getOtherTree (others: any, name = 'Unknown') {
    return {
      label: name,
      nodes: omit(others, 'inspect').map((other, otherName) => {
        return {
          label: otherName,
          nodes: functions(other)
        }
      })
    }
  }
}
