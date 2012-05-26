(function(){
    dui.$window.event('resize', function(){
        dui.updateWindowStat();
        dui.autoResizeContainer();
    });
    dui.$('.dialog .close').event('click', function(){
        dui.$dialogShadow.css('display', 'none');
        dui.$('.dialog').css('display', 'none');
    });
    //剧情提示框三个按钮的事件代码
    dui.$eventAlertYN.find('.ea-yes').event('click', function(){
        var eid = dui.$eventAlertYN.attr('eid');
        //TODO
        dui.$eventAlertYN.attr('eid', '-1').css({
            'display': 'none',
            'opacity': '0'
        });
        dui.$alertShadow.css('display', 'none');
    });
    dui.$eventAlertYN.find('.ea-no').event('click', function(){
        var eid = dui.$eventAlertYN.attr('eid');
        //TODO
        dui.$eventAlertYN.attr('eid', '-1').css({
            'display': 'none',
            'opacity': '0'
        });
        dui.$alertShadow.css('display', 'none');
    });
    dui.$eventAlertOK.find('.ea-ok').event('click', function(){
        var eid = dui.$eventAlertOK.attr('eid');
        //TODO
        dui.$eventAlertOK.attr('eid', '-1').css({
            'display': 'none',
            'opacity': '0'
        });
        dui.$alertShadow.css('display', 'none');
    });
    dui.updateWindowStat();
    dui.autoResizeContainer();
    dui.marketDialog();
    dui.eventAlert('23456', 'asdasdasd');
})();

