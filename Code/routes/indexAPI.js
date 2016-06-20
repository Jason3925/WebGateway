var express = require('express');
var router = express.Router();

var apiLogin = require('./api/apiLogin');
var apiTenant = require('./api/apiTenant');

var apiSummary = require('./api/apiSummary');
var apiExtensions = require('./api/apiExtensions');
var apiVoiceMail = require('./api/apiVoiceMail');
var apiSystemExtensions = require('./api/apiSystemExtensions');
var apiDomain = require('./api/apiDomain');
var apiTransports = require('./api/apiTransports');
var apiProviders = require('./api/apiProviders');
var apiInboundRules = require('./api/apiInboundRules');
var apiOutboundRules = require('./api/apiOutboundRules');
var apiRingGroups = require('./api/apiRingGroups');
var apiCallQueue = require('./api/apiCallQueue');
var apiCallSessions = require('./api/apiCallSessions');
var apiRecordings = require('./api/apiRecordings');
var apiCallReports = require('./api/apiCallReports');
var apiBilling = require('./api/apiBilling');
var apiNumberBlackList = require('./api/apiNumberBlackList');
var apiSettings = require('./api/apiSettings');
var apiServersStatus = require('./api/apiServersStatus');
var apiLicense = require('./api/apiLicense');
var apiConference = require('./api/apiConference');
var apiMediaServer = require('./api/apiMediaServer');
var apiVirtualReceptionist = require('./api/apiVirtualReceptionist');


function superMan(action, msg) {
  return function(req, res, next) {
    var reqJSON = req.method === 'GET' ? req.query : req.method === 'POST' ? req.body : {};
    action(reqJSON, function(err, data) {
      var resJSON = data;
      if (err) {
        resJSON = {err_code : err.err_code || 500, msg: err.msg|| msg};
      }
      res.json(resJSON).end();
    });
  }
}

router.post('/account/credentials/verify', superMan(apiLogin.login, 'Account Credentials Verify ERROR'));
router.post('/account/sign_out', superMan(apiLogin.logout, 'Account Sign OUT ERROR'));
router.post('/account/token/refresh', superMan(apiLogin.tokenRefresh, 'Account Token Refresh ERROR'));

router.get('/account/show', superMan(apiTenant.accountShow, 'Account Show ERROR'));
router.get('/account/list', superMan(apiTenant.tenantList, 'Account List ERROR'));
router.post('/account/update', superMan(apiTenant.accountUpdate, 'Account Update ERROR'));
router.post('/account/create', superMan(apiTenant.accountCreate, 'Account Create ERROR'));
router.post('/account/destroy', superMan(apiTenant.accountCreate, 'Account Destroy ERROR'));

router.post('/call_manager/summary', superMan(apiSummary.summaryShow, 'Summary Show ERROR'));



router.get('/extensions/show', superMan(apiExtensions.extensionShow, 'Extension Show ERROR'));
router.get('/extensions/list', superMan(apiExtensions.extensionList, 'Extension List ERROR'));
router.post('/extensions/create', superMan(apiExtensions.extensionCreate, 'Extension Create ERROR'));
router.post('/extensions/update', superMan(apiExtensions.extensionUpdate, 'Extension Update ERROR'));
router.post('/extensions/import', superMan(apiExtensions.extensionImport, 'Extension Import ERROR'));
router.post('/extensions/export', superMan(apiExtensions.extensionExport, 'Extension Export ERROR'));
router.post('/extensions/destroy', superMan(apiExtensions.extensionDestroy, 'Extension Destroy ERROR'));
router.get('/extensions/status', superMan(apiExtensions.extensionStatus, 'Extension Status ERROR'));
router.get('/extensions/greeting_file/list', superMan(apiVoiceMail.greetingFileList, 'GreetingFile List ERROR'));
router.post('/extensions/greeting_file/create', superMan(apiVoiceMail.greetingFileCreate, 'GreetingFile Create ERROR'));
router.post('/extensions/greeting_file/update', superMan(apiVoiceMail.greetingFileUpdate, 'GreetingFile Update ERROR'));
router.post('/extensions/greeting_file/destroy', superMan(apiVoiceMail.greetingFileDestroy, 'GreetingFile Destroy ERROR'));
router.get('/extensions/group/list', superMan(apiExtensions.extensionGroupList, 'Extension Group List ERROR'));
router.get('/extensions/group/show', superMan(apiExtensions.extensionGroupShow, 'Extension Group Show ERROR'));
router.post('/extensions/group/create', superMan(apiExtensions.extensionGroupCreate, 'Extension Group Create ERROR'));
router.post('/extensions/group/update', superMan(apiExtensions.extensionGroupUpdate, 'Extension Group Update ERROR'));
router.post('/extensions/group/destroy', superMan(apiExtensions.extensionGroupDestroy, 'Extension Group Destroy ERROR'));

router.get('/system_extensions/list', superMan(apiSystemExtensions.systemExtensionsList, 'SystemExtensions List ERROR'));

router.get('/domain/show', superMan(apiDomain.domainShow, 'Domain Show ERROR'));
router.post('/domain/update', superMan(apiDomain.domainUpdate, 'Domain Update ERROR'));

router.get('/transports/list', superMan(apiTransports.transportsList, 'Transports List ERROR'));
router.post('/transports/create', superMan(apiTransports.transportsCreate, 'Transports Create ERROR'));
router.post('/transports/destroy', superMan(apiTransports.transportsDestroy, 'Transports Destroy ERROR'));

router.get('/providers/list', superMan(apiProviders.providersList, 'Providers List ERROR'));
router.get('/providers/show', superMan(apiProviders.providersShow, 'Providers Show ERROR'));
router.post('/providers/create', superMan(apiProviders.providersCreate, 'Providers Create ERROR'));
router.post('/providers/update', superMan(apiProviders.providersUpdate, 'Providers Update ERROR'));
router.post('/providers/destroy', superMan(apiProviders.providersDestroy, 'Providers Destroy ERROR'));

router.get('/inbound_rules/list', superMan(apiInboundRules.inboundRulesList, 'InboundRule List ERROR'));
router.get('/inbound_rules/show', superMan(apiInboundRules.inboundRulesShow, 'InboundRule Show ERROR'));
router.post('/inbound_rules/create', superMan(apiInboundRules.inboundRulesCreate, 'InboundRule Create ERROR'));
router.post('/inbound_rules/update', superMan(apiInboundRules.inboundRulesUpdate, 'InboundRule Update ERROR'));
router.post('/inbound_rules/destroy', superMan(apiInboundRules.inboundRulesDestroy, 'InboundRule Destroy ERROR'));

router.get('/outbound_rules/list', superMan(apiOutboundRules.outboundRulesList, 'OutboundRule List ERROR'));
router.get('/outbound_rules/show', superMan(apiOutboundRules.outboundRulesShow, 'OutboundRule Show ERROR'));
router.post('/outbound_rules/create', superMan(apiOutboundRules.outboundRulesCreate, 'OutboundRule Create ERROR'));
router.post('/outbound_rules/update', superMan(apiOutboundRules.outboundRulesUpdate, 'OutboundRule Update ERROR'));
router.post('/outbound_rules/destroy', superMan(apiOutboundRules.outboundRulesDestroy, 'OutboundRule Destroy ERROR'));

router.get('/ring_groups/show', superMan(apiRingGroups.ringGroupsShow, 'RingGroups Show ERROR'));
router.get('/ring_groups/list', superMan(apiRingGroups.ringGroupsList, 'RingGroups List ERROR'));
router.post('/ring_groups/create', superMan(apiRingGroups.ringGroupsCreate, 'RingGroups Create ERROR'));
router.post('/ring_groups/update', superMan(apiRingGroups.ringGroupsUpdate, 'RingGroups Update ERROR'));
router.post('/ring_groups/destroy', superMan(apiRingGroups.ringGroupsDestroy, 'RingGroups Destroy ERROR'));

/*
 *  这里 CallQueue 需要调用各自服务器,api里需要些逻辑
 */
router.get('/call_queues/list', superMan(apiCallQueue.callQueueList, 'CallQueue List ERROR'));
router.get('/call_queues/show', superMan(apiCallQueue.callQueueShow, 'CallQueue Show ERROR'));
router.post('/call_queues/create', superMan(apiCallQueue.callQueueCreate, 'CallQueue Create ERROR'));
router.post('/call_queues/update', superMan(apiCallQueue.callQueueUpdate, 'CallQueue Update ERROR'));
router.post('/call_queues/destroy', superMan(apiCallQueue.callQueueDestroy, 'CallQueue Destroy ERROR'));

/*
 *  这里 VoiceMail 需要调用各自服务器,api里需要些逻辑
 */
router.get('/voice_mail/show', superMan(apiVoiceMail.voiceMailShow, 'VoiceMail Show ERROR'));
router.post('/voice_mail/update', superMan(apiVoiceMail.voiceMailUpdate, 'VoiceMail Update ERROR'));

router.get('/call_sessions/list', superMan(apiCallSessions.callSessionList, 'CallSession List ERROR'));
router.post('/call_sessions/create', superMan(apiCallSessions.callSessionCreate, 'CallSession Create ERROR'));
router.post('/call_sessions/destroy', superMan(apiCallSessions.callSessionDestroy, 'CallSession Destory ERROR'));

router.get('/recordings/list', superMan(apiRecordings.recordingsList, 'Recordings List ERROR'));
router.post('/recordings/destroy', superMan(apiRecordings.recordingsDestroy, 'Recordings Destroy ERROR'));

router.get('/call_reports/list', superMan(apiCallReports.callReportsList, 'CallReports List ERROR'));
router.get('/call_reports/show', superMan(apiCallReports.callReportsShow, 'CallReports Show ERROR'));
router.post('/call_reports/search', superMan(apiCallReports.callReportsSearch, 'CallReports Search ERROR'));

router.get('/billing/list', superMan(apiBilling.billingList, 'Billing List ERROR'));
router.post('/billing/create', superMan(apiBilling.billingCreate, 'Billing Create ERROR'));
router.post('/billing/update', superMan(apiBilling.billingUpdate, 'Billing Update ERROR'));
router.post('/billing/destroy', superMan(apiBilling.billingDestroy, 'Billing Destroy ERROR'));

router.get('/number_blacklist/list', superMan(apiNumberBlackList.numberBlackListList, 'NumberBlack List ERROR'));
router.post('/number_blacklist/create', superMan(apiNumberBlackList.numberBlackListCreate, 'NumberBlack Create ERROR'));
router.post('/number_blacklist/destroy', superMan(apiNumberBlackList.numberBlackListDestroy, 'NumberBlack Destroy ERROR'));

router.get('/settings/show', superMan(apiSettings.settingsShow, 'Settings Show ERROR'));
router.get('/settings/pbx_mode_ip/show', superMan(apiSettings.settingsWizardShow, 'SettingsWizard Show ERROR'));
router.post('/settings/update', superMan(apiSettings.settingsUpdate, 'Settings Update ERROR'));
router.post('/settings/pbx_mode_ip/update', superMan(apiSettings.settingsWizardUpdate, 'SettingsWizard Update ERROR'));

router.get('/services/status', superMan(apiServersStatus.servicesStatus, 'ServerStatus Show ERROR'));
router.post('/services/update', superMan(apiServersStatus.servicesUpdate, 'ServerStatus Update ERROR'));

router.get('/license/show', superMan(apiLicense.licenseShow, 'License Show ERROR'));
router.post('/license/update', superMan(apiLicense.licenseUpdate, 'License Update ERROR'));


/**
 * Conference
 */
/*
 *  需要转发到MCU
 */
router.get('/conference_server/list', superMan(apiConference.conferenceServerList, 'ConferenceServer List ERROR'));
router.get('/conference_server/show', superMan(apiConference.conferenceServerShow, 'ConferenceServer Show ERROR'));
router.post('/conference_server/create', superMan(apiConference.conferenceServerCreate, 'ConferenceServer Create ERROR'));
router.post('/conference_server/update', superMan(apiConference.conferenceServerUpdate, 'ConferenceServer Update ERROR'));
router.post('/conference_server/destroy', superMan(apiConference.conferenceServerDestroy, 'ConferenceServer Destroy ERROR'));

router.get('/conference_room/list', superMan(apiConference.conferenceRoomList, 'ConferenceRoom List ERROR'));
router.get('/conference_room/show', superMan(apiConference.conferenceRoomShow, 'ConferenceRoom Show ERROR'));
router.get('/conference_room/participants/list', superMan(apiConference.conferenceRoomParticipantsList,
  'ConferenceRoomParticipants List ERROR'));
router.post('/conference_room/create', superMan(apiConference.conferenceRoomCreate, 'ConferenceRoom Create ERROR'));
router.post('/conference_room/update', superMan(apiConference.conferenceRoomUpdate, 'ConferenceRoom Update ERROR'));
router.post('/conference_room/destroy', superMan(apiConference.conferenceRoomDestroy, 'ConferenceRoom Destroy ERROR'));
router.post('/conference_room/participants/update', superMan(apiConference.conferenceRoomDestroy,
  'ConferenceRoomParticipants Update ERROR'));

/**
 * Media Server
 */
router.get('/media_server/list', superMan(apiMediaServer.mediaServerList, 'MediaServer List ERROR'));
router.get('/media_server/show', superMan(apiMediaServer.mediaServerShow, 'MediaServer Show ERROR'));
router.post('/media_server/create', superMan(apiMediaServer.mediaServerCreate, 'MediaServer Create ERROR'));
router.post('/media_server/update', superMan(apiMediaServer.mediaServerUpdate, 'MediaServer Update ERROR'));
router.post('/media_server/destroy', superMan(apiMediaServer.mediaServerDestroy, 'MediaServer Destroy ERROR'));

/**
 * Virtual Receptionists
 */
/*
 * IVR 转发
 */
router.get('/virtual_receptionist/list', superMan(apiVirtualReceptionist.virtualReceptionistList,
  'VirtualReceptionistList List ERROR'));
router.get('/virtual_receptionist/show', superMan(apiVirtualReceptionist.virtualReceptionistShow,
  'VirtualReceptionistList List ERROR'));
router.post('/virtual_receptionist/create', superMan(apiVirtualReceptionist.virtualReceptionistCreate,
  'VirtualReceptionistList Create ERROR'));
router.post('/virtual_receptionist/update', superMan(apiVirtualReceptionist.virtualReceptionistUpdate,
  'VirtualReceptionistList Update ERROR'));
router.post('/virtual_receptionist/destroy', superMan(apiVirtualReceptionist.virtualReceptionistDestroy,
  'VirtualReceptionistList Destroy ERROR'));

































module.exports = router;