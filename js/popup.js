function startJob()
{
    console.log("This is popup.js");
    chrome.tabs.query(
    {
        active: true,
        currentWindow: true
    },
    function(tabs)
    {
        var tabid = tabs[0].id;
        var message = {action: "start", sender: "popup", openerTabId: tabid};
        console.log("Tab url: " + tabs[0].url);
        console.log("Tab url: " + tabs[0].id);
        chrome.extension.getBackgroundPage().setListTab(tabid);
        chrome.tabs.sendMessage(tabid, message,function(response) { });
    });
        
}
window.onload = function()
{
    document.getElementById("startbtn").onclick=function(){startJob();};
}
