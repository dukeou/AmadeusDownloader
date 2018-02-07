window.onload = function()
{
    document.getElementById("startbtn").onclick=function()
    {
        chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function(tabs)
        {
            console.log("Tab url: " + tabs[0].url);
            console.log("Tab url: " + tabs[0].id);
            chrome.extension.getBackgroundPage().startDownload(tabs[0].id, tabs[0].url);
            window.close();
        });
    };
    document.getElementById("resetbtn").onclick=function()
    {
        chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function(tabs)
        {
            console.log("Tab url: " + tabs[0].url);
            console.log("Tab url: " + tabs[0].id);
            chrome.extension.getBackgroundPage().resetDownload(tabs[0].id);
            window.close();
        });
    };
}
