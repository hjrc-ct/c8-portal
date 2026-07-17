const installLogs = [
`
helm repo add camunda https://helm.camunda.io

helm repo update

UNAMESPACE=raghu-makelabs-in-mls-c8-labs envsubst < values-combined-ingress.yaml > values-combined-ingress.my-ns.yaml

UNAMESPACE=raghu-makelabs-in-mls-c8-labs envsubst < values-connectors-env.yaml   > values-connectors-env.my-ns.yaml

helm install raghu-makelabs-in-mls-c8-labs camunda/camunda-platform \
  -f values-combined-ingress.my-ns.yaml \
  -f values-connectors-env.my-ns.yaml \
  --set zeebe.prometheusServiceMonitor.enabled=true \
  --version 14.4.1 --namespace raghu-makelabs-in-mls-c8-labs
"camunda" already exists with the same configuration, skipping
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "camunda" chart repository
...Successfully got an update from the "prometheus-community" chart repository
...Successfully got an update from the "ingress-nginx" chart repository
...Successfully got an update from the "elastic" chart repository
...Successfully got an update from the "grafana" chart repository
Update Complete. ⎈Happy Helming!⎈
I0717 10:07:24.173258    3303 warnings.go:107] "Warning: autopilot-workload-defaulter:Autopilot added tolerations matching: cloud.google.com/gke-spot"
I0717 10:07:24.173326    3303 warnings.go:107] "Warning: autopilot-default-resources-mutator:The max supported TerminationGracePeriodSeconds is 25 seconds when using toleration of cloud.google.com/gke-spot=true:NoSchedule. Defaulting down from configured 30 seconds to 25 seconds."
I0717 10:07:24.246487    3303 warnings.go:107] "Warning: autopilot-workload-defaulter:Autopilot added tolerations matching: cloud.google.com/gke-spot"
I0717 10:07:24.246552    3303 warnings.go:107] "Warning: autopilot-default-resources-mutator:The max supported TerminationGracePeriodSeconds is 25 seconds when using toleration of cloud.google.com/gke-spot=true:NoSchedule. Defaulting down from configured 30 seconds to 25 seconds."
I0717 10:07:24.246511    3303 warnings.go:107] "Warning: autopilot-workload-defaulter:Autopilot added tolerations matching: cloud.google.com/gke-spot"
I0717 10:07:24.246626    3303 warnings.go:107] "Warning: autopilot-default-resources-mutator:The max supported TerminationGracePeriodSeconds is 25 seconds when using toleration of cloud.google.com/gke-spot=true:NoSchedule. Defaulting down from configured 30 seconds to 25 seconds."
I0717 10:07:24.304322    3303 warnings.go:107] "Warning: autopilot-workload-defaulter:Autopilot added tolerations matching: cloud.google.com/gke-spot"
I0717 10:07:24.304368    3303 warnings.go:107] "Warning: autopilot-default-resources-mutator:The max supported TerminationGracePeriodSeconds is 25 seconds when using toleration of cloud.google.com/gke-spot=true:NoSchedule. Defaulting down from configured 30 seconds to 25 seconds."
I0717 10:07:24.586990    3303 warnings.go:107] "Warning: autopilot-workload-defaulter:Autopilot added tolerations matching: cloud.google.com/gke-spot"
I0717 10:07:24.587057    3303 warnings.go:107] "Warning: autopilot-default-resources-mutator:The max supported TerminationGracePeriodSeconds is 25 seconds when using toleration of cloud.google.com/gke-spot=true:NoSchedule. Defaulting down from configured 30 seconds to 25 seconds."
NAME: raghu-makelabs-in-mls-c8-labs
LAST DEPLOYED: Fri Jul 17 10:07:11 2026
NAMESPACE: raghu-makelabs-in-mls-c8-labs
STATUS: deployed
REVISION: 1
DESCRIPTION: Install complete
TEST SUITE: None
NOTES:
# (Chart version: camunda-platform 14.4.1 - Camunda compatibility version: 8.9.x)

 ######     ###    ##     ## ##     ## ##    ## ########     ###
##    ##   ## ##   ###   ### ##     ## ###   ## ##     ##   ## ##
##        ##   ##  #### #### ##     ## ####  ## ##     ##  ##   ##
##       ##     ## ## ### ## ##     ## ## ## ## ##     ## ##     ##
##       ######### ##     ## ##     ## ##  #### ##     ## #########
##    ## ##     ## ##     ## ##     ## ##   ### ##     ## ##     ##
 ######  ##     ## ##     ##  #######  ##    ## ########  ##     ##

###################################################################

## Installed Services:

- Console:
  - Enabled: true
  - Docker Image used for Console: camunda/console:8.9.45
- Orchestration:
  - Enabled: true
  - Docker Image used for Orchestration: camunda/camunda:8.9.7
  - Zeebe Cluster Name: "raghu-makelabs-in-mls-c8-labs-zeebe"
  - Prometheus ServiceMonitor Enabled: false
- Optimize:
  - Enabled: true
  - Docker Image used for Optimize: camunda/optimize:8.9.7
- Connectors:
  - Enabled: true
  - Docker Image used for Connectors: camunda/connectors-bundle:8.9.5
- Identity:
  - Enabled: true
  - Docker Image used for Identity: camunda/identity:8.9.4
  - Keycloak: camunda/keycloak:26.3.3
- Web Modeler:
  - Enabled: false
- Elasticsearch:
  - Enabled: false

### Orchestration (Zeebe, Operate, Tasklist, and Identity)

The Cluster itself is not exposed as a service which means that you can use "kubectl port-forward" to access the Orchestration cluster from outside Kubernetes:

> kubectl port-forward svc/raghu-makelabs-in-mls-c8-labs-zeebe-gateway 26500:26500 -n raghu-makelabs-in-mls-c8-labs
> kubectl port-forward svc/raghu-makelabs-in-mls-c8-labs-zeebe-gateway 8080:8080 -n raghu-makelabs-in-mls-c8-labs

Now you can connect your workers and clients to "localhost:26500" for gRPC or "localhost:8080" for REST API usage.


### Connecting to Web apps

As part of the Helm charts, an ingress definition can be deployed, but you require to have an Ingress Controller for that Ingress to be Exposed.

If you don't have an ingress controller you can use "kubectl port-forward" to access the deployed web application from outside the cluster:

Identity:
> kubectl port-forward svc/raghu-makelabs-in-mls-c8-labs-identity 8084:80
Optimize:
> kubectl port-forward svc/raghu-makelabs-in-mls-c8-labs-optimize 8083:80

Connectors:
> kubectl port-forward svc/raghu-makelabs-in-mls-c8-labs-connectors 8086:8080
Console:
> kubectl port-forward svc/raghu-makelabs-in-mls-c8-labs-console 8087:80

If you want to use different ports for the services, please adjust the related configs in the values file since these ports are used as redirect URLs for Keycloak.

Authentication via Identity/Keycloak is enabled. To login into one of the services please port-forward to Keycloak
as well, otherwise, a login will not be possible. Make sure you use "18080" as a port.

> kubectl port-forward svc/raghu-makelabs-in-ml 18080:80

Now you can point your browser to one of the service's login pages.

Default user and password: "demo/"

- Camunda gRPC API: http://raghu-makelabs-in-mls-c8-labs-zeebe-gateway.makelabs.in

## Console configuration

- name: raghu-makelabs-in-mls-c8-labs
  namespace: raghu-makelabs-in-mls-c8-labs
  version: 14.4.1
  tags:
  - dev
  custom-properties: []
  components:
  - name: Console
    id: console
    version: 8.9.45
    url: http://localhost:8087
    readiness: http://raghu-makelabs-in-mls-c8-labs-console.raghu-makelabs-in-mls-c8-labs:9100/health/readiness
    metrics: http://raghu-makelabs-in-mls-c8-labs-console.raghu-makelabs-in-mls-c8-labs:9100/prometheus
  - name: Keycloak
    id: keycloak
    version: 26.3.3
    url: https://raghu-makelabs-in-mls-c8-labs.makelabs.in/auth
  - name: Identity
    id: identity
    version: 8.9.4
    url: http://localhost:8080
    readiness: http://raghu-makelabs-in-mls-c8-labs-identity.raghu-makelabs-in-mls-c8-labs:82/actuator/health
    metrics: http://raghu-makelabs-in-mls-c8-labs-identity.raghu-makelabs-in-mls-c8-labs:82/actuator/prometheus
  - name: Optimize
    id: optimize
    version: 8.9.7
    url: http://localhost:8083
    readiness: http://raghu-makelabs-in-mls-c8-labs-optimize.raghu-makelabs-in-mls-c8-labs:80/optimize/api/readyz
    metrics: http://raghu-makelabs-in-mls-c8-labs-optimize.raghu-makelabs-in-mls-c8-labs:8092/actuator/prometheus
  - name: Connectors
    id: connectors
    version: 8.9.5
    url: http://raghu-makelabs-in-mls-c8-labs-connectors.raghu-makelabs-in-mls-c8-labs:8080/connectors
    readiness: http://raghu-makelabs-in-mls-c8-labs-connectors.raghu-makelabs-in-mls-c8-labs:8080/connectors/actuator/health/readiness
    metrics: http://raghu-makelabs-in-mls-c8-labs-connectors.raghu-makelabs-in-mls-c8-labs:8080/connectors/actuator/prometheus
  - name: Operate
    id: operate
    version: 8.9.7
    url: http://localhost:8080/operate
    readiness: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/health/readiness
    metrics: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/prometheus
  - name: Tasklist
    id: tasklist
    version: 8.9.7
    url: http://localhost:8080/tasklist
    readiness: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/health/readiness
    metrics: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/prometheus
  - name: Orchestration Identity
    id: orchestrationIdentity
    version: 8.9.7
    url: http://localhost:8080/identity
    readiness: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/health/readiness
    metrics: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/prometheus

  - name: Orchestration Cluster
    id: orchestration
    version: 8.9.7
    urls:
      grpc: http://raghu-makelabs-in-mls-c8-labs-zeebe-gateway.makelabs.in
      http: http://localhost:8080
    readiness: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/health/readiness
    metrics: http://raghu-makelabs-in-mls-c8-labs-zeebe.raghu-makelabs-in-mls-c8-labs:9600/orchestration/actuator/prometheus

[camunda][warning] DEPRECATION: The following Bitnami-based subcharts are deprecated and will be removed in Camunda 8.10: [identityKeycloak]. Please migrate to externally managed services before upgrading to 8.10. For more details: https://docs.camunda.io/self-managed/deployment/helm/operational-tasks/migration-from-bitnami/

  

  
[camunda][warning] DEPRECATION: values.yaml is using legacy option 'global.elasticsearch.tls.secret'. This option is deprecated and will be removed in a future version. Please migrate to the new option: 'orchestration.data.secondaryStorage.(elasticsearch|opensearch).tls.secret.existingSecret' or for optimize: 'optimize.database.(elasticsearch|opensearch).tls.secret.existingSecret'
[camunda][warning] DEPRECATION: values.yaml is using legacy option 'global.elasticsearch.enabled'. This option is deprecated and will be removed in a future version. Please migrate to the new option: 'orchestration.data.secondaryStorage.(elasticsearch|opensearch).enabled'. or for optimize: 'optimize.database.(elasticsearch|opensearch).enabled'.


## [info] Helm chart release highlights
- Some values have been renamed or moved in the new chart structure.
- When upgraded from 8.8 to 8.9, manual adjustments may be required for some cases like custom configurations.
- Please refer to the official docs for more details.
https://docs.camunda.io/docs/self-managed/deployment/helm/upgrade/upgrade-hc-880-890/
`,
"\n",
"Happy Learning with c8-labs ! 🚀",
"\n",
];

let timer;

function showInstallLogs() {
    document.getElementById("install-log-modal").style.display="flex";
    const body=document.getElementById("terminal-log");
    body.innerHTML="";
    let i=0;
    timer=setInterval(()=>{
        if(i>=installLogs.length){
            clearInterval(timer);
            body.innerHTML += "<span class='cursor'></span>";
            return;
        }
        body.innerHTML += installLogs[i]+"\n";
        body.scrollTop=body.scrollHeight;
        i++;
    },170);
}

function closeInstallLogs(){
    clearInterval(timer);
    document.getElementById("install-log-modal").style.display="none";
}