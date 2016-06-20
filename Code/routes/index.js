var express = require('express');
var router = express.Router();
var login = require('./login/login');


var wizards = require('./menu/wizards');
var main = require('./menu/main');
var callManager = require('./menu/CallManager');
var doMainsAndTransports = require('./menu/domainsAndTransports');
var phones = require('./menu/phones');
var extensions = require('./menu/extensions');
var systemExtensions = require('./menu/systemExtensions');
var voIPProvidersAndTrunks = require('./menu/voIPProvidersAndTrunks');
var inboundRules = require('./menu/inboundRules');
var outboundRules = require('./menu/outboundRules');
var ringGroups = require('./menu/ringGroups');
var virtualReceptionist = require('./menu/virtualReceptionist');
var callQueue = require('./menu/callQueue');
var conference = require('./menu/conference');
var voiceMail = require('./menu/voiceMail');
var contacts = require('./menu/contacts');

var tenant = require('./menu/tenant');
var recordingsManagement = require('./menu/recordingsManagement');
var callSessions = require('./menu/callSessions');
var callReports = require('./menu/callReports');

var billing = require('./menu/billing');
var settings = require('./menu/settings');
var mediaServer = require('./menu/mediaServer');
var conferenceServer = require('./menu/conferenceServer');
var servicesStatus = require('./menu/servicesStatus');
var numberBlacklist = require('./menu/numberBlacklist');
var license = require('./menu/licence');

var profile = require('./menu/profile');

var error = require('./error/error');


///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

/**
 * 根目录请求
 */
//router.get('/', login.mainGet);
router.get('/login', login.loginGet);


/**
 * 登陆请求
 */
router.post('/login',login.loginPost);
router.post('/logout',login.logoutPost);


/**
 * 首页请求
 */
router.get('/index',login.indexGet);


/**
 * 首页内容请求
 */
router.get('/main', main.mainGet);
router.get('/main/news', main.showNews);

router.get('/wizards/one', wizards.stepOne);
router.get('/wizards/two', wizards.stepTwo);

/**
 * CallManager Information
 */
router.get('/callManager/information', callManager.cmiGet);
/**
 * DomainsAndTransports
 */
router.get('/callManager/domain', doMainsAndTransports.dtGet);
router.get('/callManager/domain/show', doMainsAndTransports.domainShow);
router.get('/callManager/transports/list', doMainsAndTransports.transportsList);
router.post('/callManager/domain/update', doMainsAndTransports.updateDomainPost);
router.get('/callManager/domain/transports/update', doMainsAndTransports.updateTransportsGet);
router.post('/callManager/domain/transports/update', doMainsAndTransports.updateTransportsPost);
router.post('/callManager/domain/transports/delete', doMainsAndTransports.deleteTransportsPost);
router.post('/callManager/domain/transports/upload', doMainsAndTransports.uploadCertificates);

/**
 * Phones
 */
router.get('/callManager/phones', phones.phonesGet);

/**
 * Extensions
 */
router.get('/callManager/extension', extensions.exGet);
router.get('/callManager/extension/list', extensions.extensionListGet);
router.get('/callManager/extension/create', extensions.addExtensionsGet);
router.post('/callManager/extension/create', extensions.addExtensionsPost);
router.get('/callManager/extension/update', extensions.updateExtensionGet);
router.post('/callManager/extension/update', extensions.updateExtensionPost);
router.post('/callManager/extension/delete', extensions.deleteExtensionPost);
router.post('/callManager/extension/import', extensions.importFile);
router.get('/callManager/extension/export', extensions.exportFile);
router.get('/callManager/extension/phone/models', extensions.getPhoneModelsGet);


router.get('/callManager/extension/group', extensions.extensionGroupGet);
router.get('/callManager/extension/group/create', extensions.addGroupGet);
router.post('/callManager/extension/group/create', extensions.addGroupPost);
router.get('/callManager/extension/group/update', extensions.updateGroupGet);
router.post('/callManager/extension/group/update', extensions.updateGroupPost);
router.post('/callManager/extension/group/delete', extensions.deleteGroupPost);

router.post('/callManager/extension/greeting/delete', extensions.deleteGreetingFile);
router.post('/callManager/extension/greeting/update', extensions.updateGreetingFile);
router.post('/callManager/extension/greeting/upload', extensions.uploadGreetingFile);

/**
 * System Extensions
 */
router.get('/callManager/systemExtensions', systemExtensions.sexGet);

/**
 * VoIP Providers Trunks
 */
router.get('/callManager/voIp', voIPProvidersAndTrunks.vptGet);
router.get('/callManager/voIp/provider', voIPProvidersAndTrunks.addProviderGet);
router.get('/callManager/voIp/provider/update', voIPProvidersAndTrunks.updateProviderGet);
router.post('/callManager/voIp/provider', voIPProvidersAndTrunks.addProviderPost);
router.post('/callManager/voIp/provider/update', voIPProvidersAndTrunks.updateProviderPost);
router.post('/callManager/voIp/provider/delete', voIPProvidersAndTrunks.deleteProviderPost);
//router.get('/callManager/voIp/provider/next', voIPProvidersAndTrunks.addProviderNextGet);

/**
 * Inbound Rules
 */
router.get('/callManager/inbound', inboundRules.irGet);
router.get('/callManager/inbound/create', inboundRules.addInboundRuleGet);
router.post('/callManager/inbound/create', inboundRules.addInboundRulePost);
router.get('/callManager/inbound/update', inboundRules.updateInboundRuleGet);
router.post('/callManager/inbound/update', inboundRules.updateInboundRulePost);
router.post('/callManager/inbound/delete', inboundRules.deleteInboundRulesPost);

/**
 * Outbound Rules
 */
router.get('/callManager/outbound', outboundRules.orGet);
router.get('/callManager/outbound/rule', outboundRules.addOutboundRuleGet);
router.get('/callManager/outbound/rule/update', outboundRules.updateOutboundRuleGet);
router.post('/callManager/outbound/rule', outboundRules.addOutboundRulePost);
router.post('/callManager/outbound/rule/update', outboundRules.updateOutboundRulePost);
router.post('/callManager/outbound/delete', outboundRules.deleteOutboundRulePost);

/**
 * Ring Groups
 */
router.get('/callManager/ringGroups', ringGroups.rgGet);
router.get('/callManager/ringGroups/list', ringGroups.ringGroupsList);
router.get('/callManager/ringGroups/ringGroup', ringGroups.addRingGroupGet);
router.get('/callManager/ringGroups/ringGroup/update', ringGroups.updateRingGroupGet);
router.post('/callManager/ringGroups/ringGroup', ringGroups.addRingGroupPost);
router.post('/callManager/ringGroups/ringGroup/update', ringGroups.updateRingGroupPost);
router.post('/callManager/ringGroups/ringGroup/delete', ringGroups.deleteRingGroupPost);

/**
 * Virtual Receptionist
 */
router.get('/callManager/virtualReceptionist', virtualReceptionist.vrGet);
router.get('/callManager/virtualReceptionist/list', virtualReceptionist.virtualReceptionistList);
router.get('/callManager/virtualReceptionist/create', virtualReceptionist.addVirtualReceptionistGet);
router.post('/callManager/virtualReceptionist/create', virtualReceptionist.addVirtualReceptionistPost);
router.post('/callManager/virtualReceptionist/ivr/create', virtualReceptionist.addVirtualReceptionistIVRPost);
router.get('/callManager/virtualReceptionist/update', virtualReceptionist.updateVirtualReceptionistGet);
router.post('/callManager/virtualReceptionist/update', virtualReceptionist.updateVirtualReceptionistPost);
router.post('/callManager/virtualReceptionist/ivr/update', virtualReceptionist.updateVirtualReceptionistIVRPost);
router.post('/callManager/virtualReceptionist/delete', virtualReceptionist.deleteVirtualReceptionistPost);
router.post('/callManager/virtualReceptionist/upload', virtualReceptionist.uploadPromptFile);

/**
 * Call Queue
 */
router.get('/callManager/callQueue', callQueue.cqGet);
router.get('/callManager/callQueue/create', callQueue.addCallQueueGet);
router.post('/callManager/callQueue/create', callQueue.addCallQueuePost);
router.post('/callManager/callQueue/cq/create', callQueue.addCallQueuePostCQ);
router.get('/callManager/callQueue/update', callQueue.updateCallQueueGet);
router.post('/callManager/callQueue/update', callQueue.updateCallQueuePost);
router.post('/callManager/callQueue/cq/update', callQueue.updateCallQueuePostCQ);
router.post('/callManager/callQueue/delete', callQueue.deleteCallQueuePost);
router.post('/callManager/callQueue/upload', callQueue.uploadCallQueuesFile);

/**
 * Conference
 */
router.get('/callManager/conference/room', conference.coGet);
router.get('/callManager/conference/room/addRoom', conference.addRoomGet);
router.get('/callManager/conference/room/updateRoom', conference.updateRoomGet);
router.post('/callManager/conference/room/addRoom', conference.addRoomPost);
router.post('/callManager/conference/room/updateRoom', conference.updateRoomPost);
router.post('/callManager/conference/room/delete', conference.deleteRoomPost);

router.get('/callManager/conference/room/participants', conference.participants);
router.post('/callManager/conference/room/participants/update', conference.participantsUpdatePost);

/**
 * Voice Mail
 */
router.get('/callManager/voiceMain', voiceMail.vmGet);
router.get('/callManager/voiceMain/show', voiceMail.vmShowGet);
router.get('/callManager/voiceMain/greetingFileList', voiceMail.vmGRTFListGet);
router.post('/callManager/voiceMain/update', voiceMail.vmUpdate);
router.post('/callManager/voiceMain/create', voiceMail.vmCraete);

/**
 * Contacts
 */
router.get('/callManager/contacts', contacts.conGet);
router.get('/callManager/contacts/create', contacts.addContactsGet);
router.post('/callManager/contacts/create', contacts.addContactsPost);
router.post('/callManager/contacts/delete', contacts.deleteContactsPost);
router.get('/callManager/contacts/update', contacts.updateContactsGet);
router.post('/callManager/contacts/update', contacts.updateContactsPost);

router.get('/callManager/contacts/group', contacts.contactsGroup);
router.get('/callManager/contacts/group/create', contacts.contactsGroupCreateGet);
router.post('/callManager/contacts/group/create', contacts.contactsGroupCreatePost);
router.post('/callManager/contacts/group/delete', contacts.contactsGroupDeletePost);
router.get('/callManager/contacts/group/update', contacts.contactsGroupUpdateGet);
router.post('/callManager/contacts/group/update', contacts.contactsGroupUpdatePost);

///**
// * Call History
// */
//router.get('/callManager/callHistory', callHistory.chGet);


/**
 * Tenant
 */
router.get('/tenant', tenant.tenantGet);
router.get('/tenant/addTenant', tenant.addTenantGet);
router.post('/tenant/addTenant', tenant.addTenantPost);
router.get('/tenant/updateTenant', tenant.updateTenantGet);
router.post('/tenant/updateTenant', tenant.updateTenantPost);
router.post('/tenant/deleteTenant', tenant.destroyTenantPost);
/**
 * Recordings Management
 */
router.get('/recordingsManagement', recordingsManagement.recordingsGet);
router.post('/recordingsManagement/delete', recordingsManagement.recordingsDeletePost);
/**
 * Call Sessions
 */
router.get('/callSessions', callSessions.csGet);
router.post('/callSessions/stop', callSessions.csStopPost);
/**
 * Call Reports
 */
router.get('/callManager/callReports', callReports.crGet);
router.get('/callManager/callReports/show', callReports.crShowGet);
router.get('/callManager/callReports/search', callReports.searchGet);
router.post('/callManager/callReports/search', callReports.searchPost);
router.get('/callManager/callReports/download', callReports.downloadGet);

/**
 * Billing
 */
router.get('/billing', billing.billingGet);
router.get('/billing/create', billing.billingAddGet);
router.post('/billing/create', billing.billingAddPost);
router.get('/billing/update', billing.billingUpdateGet);
router.post('/billing/update', billing.billingUpdatePost);
router.post('/billing/delete', billing.billingDestroyPost);

/**
 * Settings
 */
router.get('/settings', settings.settingGet);
router.get('/settings/wizard/show', settings.settingWizardShow);
router.post('/settings/wizard/update', settings.settingWizardUpdate);
router.post('/settings/update', settings.settingUpdatePost);
/**
 * Media Server
 */
router.get('/settings/mediaServer', mediaServer.msGet);
router.get('/settings/mediaServer/addServer', mediaServer.addServerGet);
router.post('/settings/mediaServer/addServer', mediaServer.addServerPost);
router.get('/settings/mediaServer/updateServer', mediaServer.updateServerGet);
router.post('/settings/mediaServer/updateServer', mediaServer.updateServerPost);
router.post('/settings/mediaServer/destroyServer', mediaServer.destroyServerPost);
/**
 * Conference Server
 */
router.get('/settings/conferenceServer', conferenceServer.csGet);
router.get('/settings/conferenceServer/addServer', conferenceServer.addServerGet);
router.post('/settings/conferenceServer/addServer', conferenceServer.addServerPost);
router.get('/settings/conferenceServer/updateServer', conferenceServer.updateServerGet);
router.post('/settings/conferenceServer/updateServer', conferenceServer.updateServerPost);
router.post('/settings/conferenceServer/deleteServer', conferenceServer.deleteServerPost);
/**
 * Services Status
 */
router.get('/settings/servicesStatus', servicesStatus.ssGet);
router.post('/settings/servicesStatus/update', servicesStatus.servicesStatusUpdatePost);
/**
 * Number Blacklist
 */
router.get('/settings/numberBlacklist', numberBlacklist.nbGet);
router.get('/settings/numberBlacklist/create', numberBlacklist.addBlacklistGet);
router.post('/settings/numberBlacklist/create', numberBlacklist.addBlacklistPost);
router.post('/settings/numberBlacklist/delete', numberBlacklist.deleteBlackList);
/**
 * License
 */
router.get('/settings/license', license.licenceShow);
router.post('/settings/license/update', license.licenceUpdate);

/**
 * ProFile
 */
router.get('/profile', profile.profileGet);
router.post('/profile/update', profile.profileUpdatePost);



router.get('/data/downloads/*', function(req, res, next) {
  var url = req.url;
  var fileName = url.substr(url.lastIndexOf('downloads/') + 10, url.length);
  var file = './../../data/downloads/' + fileName;
  res.download(file, fileName, function(err) {
    if (err) {
      res.json({err_code: '404', msg: 'file is not exist'});
    }
    // 成功后的后续操作
    // ...
  });
});


///**
// * APi Get 请求
// * 展示API页面
// */
//router.get('/api', api.apiGet);



///**
// * Error Get 请求
// * 展示404页面
// */
//router.get('/error', error.error404Get);







module.exports = router;
