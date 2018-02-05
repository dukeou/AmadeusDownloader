function injextJs()
{
    console.log('Open : ' + window.location.href);
    var injectScript = document.createElement('script');
    injectScript.setAttribute('type', 'text/javascript');
    injectScript.text=
    ' \n\
        if(/(Search\\.QuickSearch|List)\\.serv/.test(window.location.href) && typeof(exporter) != "undefined") \n\
        { \n\
            window.myExportCfg={}; \n\
            window.myExportCfg.filename=""; \n\
            window.myExportCfg.exportedCount = 0; \n\
            window.myExportCfg.nextCount = 0; \n\
            window.myExportCfg.totalCount = 0; \n\
            window.myExportCfg.auto= false; \n\
            window.myExportCfg.openerTabId = 0; \n\
            window.myExportCfg.getRemainCount = function() \n\
            { \n\
                if(this.totalCount == 0) \n\
                    return 1; \n\
                if(this.totalCount < this.exportedCount) \n\
                    return 0; \n\
                return this.totalCount - this.exportedCount; \n\
            } \n\
            window.addEventListener("message", function(event) \n\
            { \n\
                console.log("Web received message: " + event.data.action); \n\
                if(event.origin != "https://amadeus-bvdinfo-com.iclibezp1.cc.ic.ac.uk") \n\
                    return; \n\
                console.log("RemainCount: " + window.myExportCfg.getRemainCount()); \n\
                console.log("event : " + event.data.action); \n\
                console.log("event : " + event.data.sender); \n\
                if(event.data.action == "start") \n\
                    if(typeof(window.myExportCfg) != "undefined") \n\
                    { \n\
                        if(event.data.sender == "popup") \n\
                        { \n\
                            window.myExportCfg.openerTabId = event.data.openerTabId; \n\
                        } \n\
                        window.myExportCfg.auto = true; \n\
                        if(window.myExportCfg.getRemainCount() > 0) \n\
                        { \n\
                            exporter(ExportUrl); \n\
                        } \n\
                        else \n\
                        { \n\
                            alert("Download completed"); \n\
                        } \n\
                    } \n\
            }); \n\
        } \n\
        else if(/ExportDlg\\.serv/.test(window.location.href) && typeof(opener.myExportCfg) != "undefined") \n\
        { \n\
            if(opener.myExportCfg.auto == true) \n\
            { \n\
                opener.myExportCfg.auto = false; \n\
                if(opener.myExportCfg.totalCount == 0) \n\
                    opener.myExportCfg.totalCount = companyCount; \n\
                var remainCount = opener.myExportCfg.getRemainCount(); \n\
                var start = opener.myExportCfg.exportedCount + 1; \n\
                var count = remainCount > 1000 ? 1000 : remainCount; \n\
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
                opener.myExportCfg.nextCount = end; \n\
                var exportName = document.forms[0].ctl00$ContentContainer1$ctl00$LowerContent$Formatexportoptions1$ExportDisplayName.value; \n\
     \n\
                console.log("Export default filename: " + ExportDefaultName); \n\
                console.log("Export filename: " + exportName); \n\
                console.log("Company count: " + companyCount); \n\
                console.log("RemainCount: " + remainCount); \n\
                console.log("Start: " + start); \n\
                console.log("End: " + end); \n\
                exportName = "Financial_data_" + start + "_" + end + "_" + new Date().getMilliseconds() + "_" + Math.floor(Math.random() * 100); \n\
                console.log("New export filename: " + exportName); \n\
     \n\
                document.forms[0].ctl00$ContentContainer1$ctl00$LowerContent$Formatexportoptions1$ExportDisplayName.value = exportName; \n\
                ExportController.OkClicked(); \n\
            } \n\
            else \n\
            { \n\
                opener.myExportCfg.openerTabId = 0; \n\
            } \n\
        } \n\
        else if(/Export\\.Download\\.serv/.test(window.location.href) && typeof(opener.myExportCfg) != "undefined") \n\
        { \n\
            window.addEventListener("message", function(event) \n\
            { \n\
                if(event.data.action == "complete" && opener.myExportCfg.openerTabId != 0) \n\
                { \n\
                    opener.myExportCfg.exportedCount = opener.myExportCfg.nextCount; \n\
                    window.close(); \n\
                    opener.postMessage({action: "start", sender: event.data.sender}, "https://amadeus-bvdinfo-com.iclibezp1.cc.ic.ac.uk"); \n\
                } \n\
            }); \n\
        } \n\
    '
    document.head.appendChild(injectScript);
    if(/(Search\.QuickSearch|List)\.serv/.test(window.location.href))
    {
        chrome.runtime.onMessage.addListener(function(request)
        {
            window.myopener = "auto";
            console.log("Content received message: " + request.action);
            window.postMessage(request, "https://amadeus-bvdinfo-com.iclibezp1.cc.ic.ac.uk");
        });
    }
    else if(/ExportDlg\.serv/.test(window.location.href))
    {
        var exportName = document.forms[0].ctl00$ContentContainer1$ctl00$LowerContent$Formatexportoptions1$ExportDisplayName.value;
        console.log("[Content]Export filename: " + exportName);
    }
    else if(/AsyncProgress\.serv/.test(window.location.href))
    {
    }
    else if(/Export\.Download\.serv/.test(window.location.href))
    {
        chrome.runtime.onMessage.addListener(function(request)
        {
            console.log("Content received message: " + request.action);
            window.postMessage(request, "https://amadeus-bvdinfo-com.iclibezp1.cc.ic.ac.uk");
        });
    }
}
document.addEventListener('DOMContentLoaded', injextJs);
