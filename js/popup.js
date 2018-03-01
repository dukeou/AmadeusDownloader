window.onload = function()
{
    document.getElementById("startbtn").onclick=function()
    {
        var start_index = 1;
        if(/^\d+$/.test(document.getElementById("startindex").value))
        {
            start_index = parseInt(document.getElementById("startindex").value);
            if(start_index < 1)
            {
                start_index = 1;
            }
        }
        chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function(tabs)
        {
            console.log("Tab url: " + tabs[0].url);
            console.log("Tab url: " + tabs[0].id);
            chrome.extension.getBackgroundPage().startDownload(tabs[0].id, tabs[0].url, start_index);
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
