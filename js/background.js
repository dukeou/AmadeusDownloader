var g_downloadItem = null;
var g_list = null;
var g_downloadIndex = 1;
function onDownloadCreated(item)
{
    console.log("Download created: " + item.id);
    console.log("Download created: " + item.url);
    if(g_list != null)
    {
        var urlmatch = item.url.match(/https:\/\/amadeus-bvdinfo-com\.iclibezp1\.cc\.ic\.ac\.uk.*\/Export\.Download\.serv\?.*_CID=(\d+)&context=(\w+)/);
        if(urlmatch != null)
        {
            console.log("Download file matched");
            var cid = urlmatch[1];
            var context = urlmatch[2];
            if(context == g_list.context)
            {
                console.log("Context matched");
                g_downloadItem =
                {
                    id: item.id,
                    url: item.url,
                    finalUrl: item.finalUrl,
                    referrer: item.referrer
                }
            }
        }
    }
}
function onDetermineFilename(item, suggest)
{
    console.log("onDetermineFilename: " + item.id);
    console.log("onDetermineFilename: " + item.url);
    if(g_downloadItem != null && item.finalUrl == g_downloadItem.finalUrl)
    {
        console.log("onDetermineFilename matched " + item.filename);
        suggest({filename: "" + g_downloadIndex + item.filename.match(/\.\w+$/)[0]});
    }
}
function onDownloadChange(item)
{
    console.log("onDownloadChange: " + item.id);
    //console.log("onDownloadChange: " + JSON.stringify(g_downloadItem));
    if(g_downloadItem != null && item.id == g_downloadItem.id)
    {
        if(typeof(item.state) != "undefined" && (item.state.current =="complete" || item.state.current == "interrupted"))
        {
            console.log("Download completed: " + g_downloadItem.finalUrl);
            console.log("Download tab url: " + g_downloadItem.referrer);
            chrome.tabs.query({url:g_downloadItem.referrer}, function(tabArray)
            {
                chrome.tabs.remove(tabArray[0].id);
                g_downloadItem = null;
                g_list.exportedCount += g_list.nextCount;
                g_list.nextCount = 0;
                g_downloadIndex++;
                console.log("one file download complete: " + g_list.exportedCount);
                chrome.tabs.sendMessage(g_list.tabId, {src: "AmadeusDownloader", action: "start", exportedCount: g_list.exportedCount}, function(){});
            });
        }
    }
}
chrome.downloads.onCreated.addListener(onDownloadCreated);
chrome.downloads.onDeterminingFilename.addListener(onDetermineFilename);
chrome.downloads.onChanged.addListener(onDownloadChange);
function startDownload(tabId, url, start_index)
{
    console.log("startDownload : " + tabId + " " + url);
    var urlmatch = url.match(/https:\/\/amadeus-bvdinfo-com\.iclibezp1\.cc\.ic\.ac\.uk.*\/.*&context=(\w+)/);
    if(urlmatch != null)
    {
        console.log("List url matched");
        var context = urlmatch[1];
        if(g_list == null || g_list.context != context || g_list.tabId != tabId)
        {
            g_list = 
            {
                tabId: tabId,
                context: context,
                nextCount: 0,
                exportedCount: start_index - 1
            };
            console.log("New glist");
        }
        console.log("Send start message");
        console.log("ExportedCount: " + g_list.exportedCount);
        chrome.tabs.sendMessage(tabId, {src: "AmadeusDownloader", action: "start", exportedCount: g_list.exportedCount}, function(){});
    }
}
function resetDownload(tabId)
{
    console.log("resetDownload");
    g_list = null;
    g_downloadIndex = 1;
    chrome.tabs.sendMessage(tabId, {src: "AmadeusDownloader", action: "reset"}, function(){});
}
chrome.runtime.onMessageExternal.addListener(
function(message, sender, callback)
{
    console.log("confirm message received");
    if(typeof(message.url) == "undefined" || g_list == null)
    {
        callback({result: false});
        return;
    }
    var urlmatch = message.url.match(/&context=(\w+)/);
    if(urlmatch != null)
    {
        console.log("Export url matched");
        var context = urlmatch[1];
        if(g_list.context == context)
        {
            console.log("confirm received next count: " + message.count);
            g_list.nextCount = message.count;
            callback({result: true});
            return;
        }
    }
    callback({result: false});
});
