chrome.runtime.onMessage.addListener(function(message)
{
    if(message.src == "AmadeusDownloader")
    {
        console.log("content received message: " + message.action);
        window.postMessage(message, window.location.href);
    }
});
function injextJs()
{
    console.log('Open : ' + window.location.href);
    var injectScript = document.createElement('script');
    injectScript.setAttribute('type', 'text/javascript');
    injectScript.text='var AmadeusExtensionId="' + chrome.runtime.id + '"; \n\
    window.addEventListener("message", function(event) \n\
    { \n\
        if(typeof(event.data.src) == undefined || event.data.src != "AmadeusDownloader") \n\
            return; \n\
        if(event.data.action == "reset") \n\
        { \n\
            if(typeof(window.autoExport) != "undefined") \n\
            { \n\
                console.log("autoExport false"); \n\
                window.autoExport = false; \n\
            } \n\
            return; \n\
        } \n\
        if(typeof(exporter) != "undefined" && typeof(ExportUrl) != "undefined") \n\
        { \n\
            if(event.data.action == "start") \n\
            { \n\
                console.log("Start export: " + ExportUrl); \n\
                console.log("exported count: " + event.data.exportedCount); \n\
                window.exportedCount = event.data.exportedCount; \n\
                window.autoExport = true; \n\
                console.log("exporter ExportUrl"); \n\
                exporter(ExportUrl); \n\
            } \n\
        } \n\
        else \n\
            alert("Not exportable"); \n\
    }); \n\
    if(typeof(window.ExportController) != "undefined") \n\
    { \n\
        if(typeof(opener.autoExport) != "undefined" && opener.autoExport == true) \n\
        { \n\
            opener.autoExport = false; \n\
            var remainCount = companyCount - opener.exportedCount; \n\
            if(remainCount < 0) \n\
            { \n\
                console.log("Error exportedCount: " + opener.exportedCount + " companyCount: " + companyCount); \n\
                alert("Error: please close this window and restart from previous page"); \n\
            } \n\
            else if(remainCount == 0) \n\
            { \n\
                alert("Download complete"); \n\
            } \n\
            else \n\
            { \n\
                var start = opener.exportedCount + 1; \n\
                var count = remainCount > 5000? 5000: remainCount; \n\
                var end = start + count - 1; \n\
                do{ \n\
                    document.forms[0].exportRange.checked = true; \n\
                    document.forms[0].RANGEFROM.value = start; \n\
                    document.forms[0].RANGETO.value = end; \n\
                    if(ExportController.GetWarningMessage() == null) \n\
                        break; \n\
                    count = Math.floor(count/2); \n\
                    end = start + count - 1; \n\
                }while(count > 0) \n\
                var exportName = document.forms[0].ctl00$ContentContainer1$ctl00$LowerContent$Formatexportoptions1$ExportDisplayName.value; \n\
                console.log("Export default filename: " + ExportDefaultName); \n\
                console.log("Export filename: " + exportName); \n\
                console.log("Company count: " + companyCount); \n\
                console.log("RemainCount: " + remainCount); \n\
                console.log("Start: " + start); \n\
                console.log("End: " + end); \n\
                chrome.runtime.sendMessage(AmadeusExtensionId, {count: count, url: window.location.href}, function(response) \n\
                { \n\
                    if(typeof(response) == "undefined") \n\
                    { \n\
                        console.log("Confirm failed " + chrome.runtime.lastError.message); \n\
                        for( any in chrome.runtime.lastError) \n\
                        { \n\
                            console.log("" + any); \n\
                        } \n\
                        return; \n\
                    } \n\
                    if("result" in response && response.result == true) \n\
                    { \n\
                        console.log("Count has been confirmed, starting export"); \n\
                        ExportController.OkClicked(); \n\
                    } \n\
                }); \n\
            } \n\
        } \n\
    } \n\
    window.onclose = function() \n\
    { \n\
        console.log("window is closing"); \n\
        if(typeof(window.ExportController) != "undefined") \n\
        { \n\
            if(typeof(opener.autoExport) != "undefined") \n\
                opener.autoExport = false; \n\
        } \n\
    }; \n\
    '
    document.head.appendChild(injectScript);
};
document.addEventListener('DOMContentLoaded', injextJs);
