//Libraries
{!REQUIRESCRIPT("/soap/ajax/29.0/connection.js")}


//Global variables
var approvedForDevelopment= {!SLX__Change_Control__c.Approved_for_development__c};
var submittedToRequestor = {!SLX__Change_Control__c.Submitted_to_requestor__c};
var pendingRequestorApproval= ('{!SLX__Change_Control__c.SLX__Request_Status__c}' == 'Pending Requestor Approval');


function updateStatusToValue(value)
{
//alert('update status to ' + value);
//alert('create change control and assigned id and status');
var cr = new sforce.SObject('SLX__Change_Control__c');
cr.Id = '{!SLX__Change_Control__c.Id}';
cr.SLX__Request_Status__c = ''+value;
cr.Submitted_to_requestor__c=true;
// save the change
//alert('Try to update records and reload page');
sforce.connection.update([cr]);
//refresh the page
window.location.reload();
}

function checkDevelopmentInfo()
{

var devCriteriaAssignedTo = {!SLX__Change_Control__c.Assigned_To__c!=null || SLX__Change_Control__c.Assigned_To__c!= '' };

var devCriteriaSandbox = {!SLX__Change_Control__c.Sandbox__c!=null || SLX__Change_Control__c.Sandbox__c!= '' };

var devCriteriaReleaseObject = {!SLX__Change_Control__c.Release_Object__c!=null || SLX__Change_Control__c.Release_Object__c!= '' };

var devCriteriaChangeComponents = {!SLX__Change_Control__c.Number_of_Components__c > 0};

var devCriteriaDevTestEvidence = {!SLX__Change_Control__c.TestingEvidenceUnderDevelopment__c!=null || SLX__Change_Control__c.TestingEvidenceUnderDevelopment__c!= '' };

var devCritiriaGoLiveInstructions = {!SLX__Change_Control__c.Go_Live_Instructions__c!=null || SLX__Change_Control__c.Go_Live_Instructions__c!= '' };


if(devCriteriaAssignedTo && devCriteriaSandbox && devCriteriaReleaseObject && devCriteriaChangeComponents && devCriteriaDevTestEvidence && devCritiriaGoLiveInstructions )
{
//navigateToUrl('/p/process/Submit?retURL=%2F{!SLX__Change_Control__c.Id}&id={!SLX__Change_Control__c.Id}','DETAIL','submit');
updateStatusToValue('Ready for testing - sandbox'); /*This will trigger the email alert to update UAT Evidence*/;
}
else {
msg = "Please provide "
msg = msg + (!devCriteriaAssignedTo? 'Assigned To, ':'');
msg = msg + (!devCriteriaSandbox? 'Sandbox, ':'');
msg = msg + (!devCriteriaReleaseObject? 'Release Object, ':'');
msg = msg + (!devCriteriaChangeComponents? 'Change components, ':'');
msg = msg + (!devCriteriaDevTestEvidence? 'Test Evidence under development, ':'');
msg = msg + (!devCritiriaGoLiveInstructions? 'Go Live Instructions, ':'');
msg = msg + 'before submitting CR for approval';
alert(msg);
}

}

function checkRequestorInfo()
{
var requestorCriteriaUATEvidence = ({!SLX__Change_Control__c.UATEvidence__c !=null || SLX__Change_Control__c.UATEvidence__c!= '' } && ({!$User.Id == SLX__Change_Control__c.Business_OwnerId__c || User.Id == SLX__Change_Control__c.SLX__RequestorId__c}));

if(requestorCriteriaUATEvidence)
{
navigateToUrl('/p/process/Submit?retURL=%2F{!SLX__Change_Control__c.Id}&id={!SLX__Change_Control__c.Id}','DETAIL','submit');
}
else {
alert("Please provide UAT Evidence before submitting CR for approval");
}
}

//alert('start');
if(approvedForDevelopment && !submittedToRequestor)
{
//alert('dev submission');
checkDevelopmentInfo();
}
else if (pendingRequestorApproval && submittedToRequestor)
{
//alert('operations submission');
checkRequestorInfo();
}
else
{
//alert('other approval process');
navigateToUrl('/p/process/Submit?retURL=%2F{!SLX__Change_Control__c.Id}&id={!SLX__Change_Control__c.Id}','DETAIL','submit');
}