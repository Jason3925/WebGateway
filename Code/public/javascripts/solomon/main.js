$.components.register("mMenu", {
  init: function () {
  },
  api: function () {
    var role = $.cookie('role');
    
    var menuBox = $('#menu-box');
    var _this = this;
    var lis = $('li[data-role=menu]', menuBox);
    lis.each(function () {
      //var li = $(this);

      $($('a', this)[0]).on('click', function () {

        //li.addClass('active');
        var li = $(this).parent();
        //if(li.hasClass('active')){
        //    return;
        //}
        lis.removeClass('active');
        li.addClass('active');

        _this.holdMenu($(this), _this);
        //console.log($(this).attr('data-menu'));
      });
      //$(this).on('click', function (event) {
      //
      //    //event.stopPropagation();
      //
      //    if($(this).hasClass('active')){
      //        return;
      //    }
      //
      //    lis.removeClass('active');
      //    $(this).addClass('active');
      //    _this.holdMenu($(this), _this);
      //});
    });

    //this.get('/main');
    //
    //console.log(555);
    //$.ready(function(){
    //    console.log('666656666');
    //});

    _this.wizard(_this, 'init', lis);


    //绑定API单击事件
    //$('#menu-api-a', menuBox).on('click', function () {
    //
    //});


    //登出
    $('#sign-out').off('click').on('click', function() {

      _this.AJAXPost('/logout', _this.util.parseURLPost({}))
        .success(function(data) {
          if(data && data.result === 'success') {
            // $.cookie('access_token', null);
            // window.location.reload();
          }
          $.cookie('access_token', null);
          window.location.reload();
        });

      return false;
    });

  },
  wizard: function(_this, type, lis) {
    var ep = _this.Eventproxy();
    var role = $.cookie('role');

    if (role === 'administrator' || role === 'tenant') {
      if( role !== 'extension') {
        ep.all('sData', 'dData', 'tData', function (sData, dData, tData) {
          var showWizard = false;
          if (dData && dData.domain &&
            tData && tData.transports && tData.transports.length > 0
          ) {
            showWizard = true;
          }else {
            showWizard = false;
          }
          var transports = {};
          if (tData && tData.count > 0) {
            transports.UDP = tData.transports.filter(function(o) {return o.protocol === 'UDP'})[0] ||
              {port: 5060, protocol: 'UDP', mark: 'update'};
            transports.TCP = tData.transports.filter(function(o) {return o.protocol === 'TCP'})[0] ||
              {port: 5061, protocol: 'UDP', mark: 'update'};
          }

          if(showWizard && role === 'administrator') {
            if (sData && sData.pbx_mode && sData.pbx_ip) {
              showWizard = true;
            }else {
              showWizard = false;
            }
          }
          if(type === 'main') {
            showWizard = false;
          }
          if(!showWizard) {
            // 引导页面
            _this.get('/wizards/one', function(contentBox) {
              _this.initialize(contentBox);

              ep = _this.Eventproxy();

              var wizardsBox = $('#wizards-box', contentBox);
              var step1Box = $('#wizards-step1', wizardsBox);
              var step2Box = $('#wizards-step2', wizardsBox);
              var step3Box = $('#wizards-step3', wizardsBox);
              var step3BoxShow = true;



              (function init() {

                $('#step1-ip', step1Box).focus();

                var selectBox = $('#step1-select', step1Box);

                //console.log(role);
                if (role !== 'administrator' && role !== 'admin') {
                  selectBox.attr('disabled', true);
                  $('#step1-ip', step1Box).attr('disabled', true);
                }
                showStep1();


                // step1 默认值
                selectBox.off('change').on('change', function() {
                  if ($(this).select().val() === '0' ) {
                    $('#step1-ip-text').html('Public network IP');
                    $('#step1-ip').attr('placeholder', 'Public IP');
                  }
                  if ($(this).select().val() === '1' ) {
                    $('#step1-ip-text').html('Private network IP');
                    $('#step1-ip').attr('placeholder', 'Private IP');
                  }
                });
                if (sData && sData.pbx_mode) {
                  if (sData.pbx_mode === 'public network') {
                    selectBox.val('0').trigger('change');
                  }
                  if (sData.pbx_mode === 'private network') {
                    selectBox.val('1').trigger('change');
                  }
                }
                if (sData && sData.pbx_ip) {
                  $('#step1-ip', step1Box).val(sData.pbx_ip);
                }
                // step2 默认值
                if (dData && dData.domain) {
                  $('#step2Domain', step2Box).val(dData.domain);
                }
                // step3 默认值
                var ts = {};
                if (tData && tData.count >0 ) {
                  ts = tData.transports.filter(function(o) {return o.protocol === 'UDP' || o.protocol === 'TCP'});
                }
                if (role !== 'administrator' && ts[0]) {
                  $('#step3-select', step3Box).attr('disabled', true);
                  $('#step3-port', step3Box).attr('disabled', true);
                }
                if (ts[0]) {
                  step3BoxShow = false;
                }

                if (ts.length === 2) {
                  ts = ts[0].protocol === 'UDP' ? ts[0] : ts[1];
                }else if(ts.length === 1) {
                  ts = ts[0];
                }
                ts = (ts && ts.port) ? ts : {port: '5060', protocol: 'UDP'};
                $('#step3-select', step3Box).val(ts.protocol);
                $('#step3-port', step3Box).val(ts.port);
                $('#step3-select', step3Box).on('change', function() {
                  var portInput = $('#step3-port', step3Box);
                  if($(this).val() === 'UDP' ) {
                    portInput.val('5060');
                  }
                  if($(this).val() === 'TCP' ) {
                    portInput.val('5063');
                  }
                });

              })();

              $('#wizards-step1-next', step1Box).off('click').on('click', function() {
                showStep2();
              });
              $('#step1-ip', step1Box).off('keydown').on('keydown', function(e) {
                if (e.keyCode === 13) {
                  showStep2();
                }
              });
              $('#step2Domain', step2Box).off('keydown').on('keydown', function(e) {
                if (e.keyCode === 13) {
                  showStep3();
                }
              });
              $('#step3-port', step3Box).off('keydown').on('keydown', function(e) {
                if (e.keyCode === 13) {
                  wizardsSubmit();
                }
              });

              $('#wizards-step2-next', step2Box).off('click').on('click', function() {
                showStep3();
              });
              $('#wizards-step2-previous', step2Box).off('click').on('click', function() {
                showStep1();
              });
              $('#wizards-step3-next', step3Box).off('click').on('click', function() {
                wizardsSubmit();
              });
              $('#wizards-step3-previous', step3Box).off('click').on('click', function() {
                showStep2();
              });
              function showStep1() {
                step1Box.removeClass('hide');
                step2Box.removeClass('hide').addClass('hide');
                step3Box.removeClass('hide').addClass('hide');
                $('#step1-ip', step1Box).focus();
              }
              function showStep2() {
                if (role === 'administrator' && !_this.util.isNull($('#step1-ip').val())) {
                  _this.show('error', "The IP can't be empty.");
                  return;
                }
                step1Box.removeClass('hide').addClass('hide');
                step2Box.removeClass('hide');
                step3Box.removeClass('hide').addClass('hide');
                $('#step2Domain', step2Box).focus();
                return false;
              }
              function showStep3() {
                if (!_this.util.isNull($('#step2Domain').val())) {
                  _this.show('error', "The domain can't be empty.");
                  return;
                }
                step1Box.removeClass('hide').addClass('hide');
                step2Box.removeClass('hide').addClass('hide');
                step3Box.removeClass('hide');
                $('#step3-port', step3Box).focus();
              }
              function wizardsSubmit() {
                var step1Select = $('#step1-select').val();
                var step1Ip = $('#step1-ip').val();

                var step2Domain = $('#step2Domain').val();

                var step3Select = $('#step3-select').val();
                var step3Port = $('#step3-port').val();

                if (!_this.util.isNull(step3Port)) {
                  _this.show('error', "the transport port can't be empty.");
                  return;
                }

                if (!isNaN(step3Port)) {
                  step3Port = parseInt(step3Port);
                }

                var step1ReqJSON = {
                  pbx_mode: step1Select === '0' ? 'public network' : step1Select === '1' ? 'private network' : '',
                  pbx_ip: step1Ip,
                };
                var step2ReqJSON = {
                  domain: step2Domain,
                };
                var step3ReqJSON = {
                  protocol: step3Select,
                  port: step3Port,
                };

                ep.once('success', function(data) {
                  if (type === 'init') {
                    $($('a', $(lis[0]))[0]).trigger('click');
                  }else if (type === 'main') {
                    _this.menuDescribe['h'](_this);
                  }
                });
                ep.once('error', function(err) {
                  _this.show('error', err.msg);
                });
                //step1
                _this.AJAXPost('/settings/wizard/update', step1ReqJSON)
                  .success(function(data) {
                    //ep.emit('sData', data)

                    if(data && !data.err_code) {
                      //step2
                      _this.AJAXPost('/callManager/domain/update', step2ReqJSON)
                        .success(function(data) {
                          //ep.emit('dData', data);
                          if(data && !data.err_code) {
                            if (!step3BoxShow) {
                              ep.emit('success', data);
                            }else {
                              //step3
                              _this.AJAXPost('/callManager/domain/transports/update', step3ReqJSON)
                                .success(function(data) {
                                  if (data && !data.err_code) {
                                    ep.emit('success', data);
                                  }else {
                                    ep.emit('error', {err_code: '500', msg: 'Failed to set up the transport.'});
                                  }
                                })
                                .error(function(err) {
                                  ep.emit('error', {err_code: '500', msg: 'Failed to set up the transport.'});
                                });
                            }

                          }else {
                            ep.emit('error', {err_code: '500', msg: 'Failed to set up the SIP domain.'});
                          }
                        })
                        .error(function(err) {
                          ep.emit('error', {err_code: '500', msg: 'Failed to set up the SIP domain.'});
                        });
                    }else {
                      ep.emit('error', {err_code: '500', msg: 'Failed to set up the PBX IP.'});
                    }
                  })
                  .error(function(err) {
                    ep.emit('error', {err_code: '500', msg: 'Failed to set up the PBX IP.'});
                  });
                //_this.AJAXPost('/callManager/domain/update', step2ReqJSON)
                //  .success(function(data) {
                //    ep.emit('dData', data);
                //  })
                //  .error(function(err) {
                //    ep.emit('dData', {err_code: '500'});
                //  });

                //_this.AJAXPost('/callManager/domain/transports/update', step3ReqJSON)
                //  .success(function(data) {
                //    ep.emit('tData', data);
                //  })
                //  .error(function(err) {
                //    ep.emit('tData', {err_code: '500'});
                //  });
              }


            });
          }else {
            if (lis) {
              //主动触发显示主页事件
              $($('a', $(lis[0]))[0]).trigger('click');
            }
          }
        });
        ep.fail(function(err) {
          _this.show('warning', 'Wizard validation problems, please login again');
        });
        _this.AJAXGet('/settings/wizard/show')
          .success(function(data) {
            if (data && data.err_code) ep.emit('error', data);
            ep.emit('sData', data);
          })
          .error(function(err) {
            ep.emit('error', err);
            console.log('/settings/show Error', err);
          });
        _this.AJAXGet('/callManager/domain/show')
          .success(function(data) {
            if (data && data.err_code) ep.emit('error', data);
            ep.emit('dData', data);
          })
          .error(function(err) {
            ep.emit('error', err);
            console.log('/callManager/domain/show Error', err);
          });
        _this.AJAXGet('/callManager/transports/list')
          .success(function(data) {
            if (data && data.err_code) ep.emit('error', data);
            ep.emit('tData', data);
          })
          .error(function(err) {
            ep.emit('error', err);
            console.log('/callManager/domain/show Error', err);
          });
      }else {
        _this.menuDescribe['h'](_this);
      }
    }else {
      _this.menuDescribe['cmi'](_this);
    }

  },
  initialize: function (contentBox, option, backs) {
    var _this = this;
    /**
     * 绑定Change事件，获取数据时只获取data-mark等于update的元素数据
     */
    $('[data-mark]', contentBox).off('change').on('change', function () {
      $(this).attr('data-mark', 'update');
    });
    if (option && typeof option.forEach == 'function') {
      //console.log('initialize option');
      option.forEach(function (data) {
        initDetail(data);
      });
      function initDetail(type) {
        if (type == 'select') {
          /**
           * select选择项初始化
           */
          var selects = $('[data-selected]', contentBox);
          if (selects && selects.size() > 0) {
            for (var i = 0; i < selects.size(); i++) {
              var select = $(selects[i]);
              var options = $('option', select);
              if (options && options.size() > 0) {
                for (var j = 0; j < options.size(); j++) {
                  var option = $(options[j]);
                  if (option.val() == select.attr('data-selected')) {
                    option.attr('selected', 'selected');
                  }
                }
              }
              //console.log(select);
              $(select).trigger('change');
            }
          }
        }
        if (type == 'checkboxs') {
          /**
           * checkbox 多个选中初始化
           */
          var checkboxs = $('[data-checkeds]', contentBox);
          var values = checkboxs.attr('data-checkeds');
          ;
          if (values) {
            if (values.indexOf(',') > 0) {
              values = values.split(',');
              values.forEach(function (data) {
                $('[type=checkbox][value=' + data + ']').attr('checked', 'checked');
              });
            }else {
              $('[type=checkbox][value=' + values + ']').attr('checked', 'checked');
            }

          }
        }
        if (type == 'checkbox') {
          /**
           * checkbox 初始化
           */
          var checkboxs = $('[data-checked]', contentBox);
          if (checkboxs && checkboxs.size() > 0) {
            for (var i = 0; i < checkboxs.size(); i++) {
              var checkbox = $(checkboxs[i]);
              var type = checkbox.attr('type');
              if (type == 'checkbox') {
                //console.log("************");
                //console.log(checkbox.attr('data-checked'));
                if (typeof checkbox.attr('data-checked') == 'string') {
                  if (checkbox.attr('data-checked') == 'true') {
                    checkbox.attr('checked', 'checked');
                    //是否添加触发事件判断
                  }
                } else if (typeof checkbox.attr('data-checked') == 'boolean') {
                  if (checkbox.attr('data-checked')) {
                    checkbox.attr('checked', 'checked');
                    //是否添加触发事件判断
                  }
                }

              } else if (type == 'radio') {
                if (checkbox.attr('data-checked')) {

                  var name = checkbox.attr('name');
                  //console.log(name);
                  var checked = checkbox.attr('data-checked');
                  var checked_child = checkbox.attr('data-checked-child');

                  if (name) {
                    var radios = $('[name=' + name + ']', contentBox);

                    if (radios && radios.size() > 0) {
                      for (var j = 0; j < radios.size(); j++) {
                        var cbox = $(radios[j]);

                        var value = cbox.attr('value');
                        var associated = cbox.attr('data-associated');
                        var group = cbox.attr('data-group');

                        if (value == checked && !associated && !group) {
                          cbox.attr('checked', 'checked');
                          /**
                           * 触发当前元素上绑定的click事件
                           * 主要是解决一些元素上绑定了一些点击事件，但当页面加载为它赋值的时候
                           * 往往不会触发后续
                           * _data非正式方法
                           */
                          try {
                            if ($._data(cbox[0], 'events')['click']) {
                              cbox.trigger('click');
                            }
                          } catch (err) {
                            cbox.trigger('click');
                          }


                        }
                        if (value == checked && associated == 'default' && group) {
                          cbox.attr('checked', 'checked');

                          var associated_box = $('#' + group);

                          if (associated_box) {
                            var type = associated_box.attr('type');
                            if (!type) {
                              type = associated_box.attr('data-role');
                            }
                            if (type == 'select') {
                              var options = $('option', associated_box);
                              if (options && options.size() > 0) {
                                for (var k = 0; k < options.size(); k++) {
                                  var option = $(options[k]);
                                  if (option.val() == checked_child) {
                                    option.attr('selected', 'selected');
                                    associated_box.html(options).selectpicker('refresh');
                                  }
                                }
                              }
                            } else if (type == 'text') {
                              associated_box.val(checked_child);
                            }
                            //...
                          }


                        }

                      }
                    }
                  }


                }

              }

            }
          }
        }
        if (type == 'listbox') {
          //var cur_box = $('[data-listbox]', contentBox);
          //var box_id = cur_box.attr('data-listbox');
          //var active_box = $('#' + box_id + '-active');
          //
          //// 绑定选中
          //$('a', cur_box).off('click').on('click', function () {
          //  var c_a = $(this);
          //  if (c_a.hasClass('active')) {
          //    c_a.removeClass('active');
          //  } else {
          //    c_a.addClass('active')
          //  }
          //});
          //$('#' + box_id + '-right', contentBox).off('click').on('click', function () {
          //
          //  //临时实现，还需要修改
          //  //...
          //  active_box.html($('a.active', cur_box).clone().removeClass('active')).attr('data-mark', 'update');
          //
          //});

          var cur_box = $('[data-listbox]', contentBox);
          if (cur_box && typeof cur_box.map == 'function') {
            cur_box.map(function (key, data) {
              var box = $(data);
              var box_id = box.attr('data-listbox');
              if (box_id != 'default') {
                var sourceList = box.attr('data-listbox-value');
                var sourceHTML = '';
                sourceList = Immutable.List(sourceList.split(','));
                var descBox = $('#' + box_id + '-active');
                var descActive = descBox.attr('data-listbox-value');
                descActive = descActive ? descActive.split(',') : undefined;
                var descList = Immutable.Map();
                if (descActive) {
                  descActive.map(function (data, key) {
                    descList = descList.set(data, '<a class="list-group-item" href="javascript:void(0)">' + data + '</a>');
                  });
                }

                sourceList.map(function (data, key) {
                  var className = 'list-group-item';

                  if (descActive && descActive.length > 0) {
                    descActive.map(function (desc, key) {
                      if (desc == data) {
                        className += ' disabled';
                      }
                    });
                  }


                  sourceHTML += '<a class="' + className + '" href="javascript:void(0)" data-value="' + data + '">' + data + '</a>';
                });
                if (box.attr('data-remaining') > 0) {
                  sourceHTML += '<a class="list-group-item" href="javascript:void(0)" id="list-box-more">more...</a>';
                }
                box.html(sourceHTML);

                function mClick() {
                  $('a', box).off('click').on('click', function () {
                    var cur_a = $(this);
                    if (!cur_a.hasClass('disabled')) {
                      if (!cur_a.hasClass('active')) {
                        cur_a.addClass('active');
                      } else {
                        cur_a.removeClass('active');
                      }
                    }
                  });
                }
                function moreClick() {

                  var url = box.attr('data-url');
                  var page = box.attr('data-page');
                  page = parseInt(page) + 1;
                  box.attr('data-page', page);
                  url += '?page='+page;

                  var newOptions = '';
                  _this.AJAXGet(url)
                    .success(function(data) {
                      if(data.count>0) {
                        data.extensions.map(function(data, key) {
                          var className = 'list-group-item';
                          if (descActive && descActive.length > 0) {
                            if(descActive.filter(function(desc){return desc === data.extension_number}).length>0){
                              className += ' disabled';
                            }
                          }
                          newOptions += '<a class="' + className + '" href="javascript:void(0)" data-value="'
                            + data.extension_number + '">' + data.extension_number + '</a>';
                        });

                        var options = $('a', box);
                        var more = options[options.length-1];
                        delete options[options.length-1];
                        box.html(options);
                        box.append(newOptions);
                        if (data.remaining_extensions > 0) {
                          box.attr('data-page', page);
                          $(more).off('click').removeClass('active');
                          box.append(more);
                        }
                        mClick();
                        $('#list-box-more', box).on('click', moreClick);
                      }
                    });
                };
                mClick();

                $('#list-box-more', box).on('click', moreClick);

                $('#' + box_id + '-right').off('click').on('click', function () {
                  $('a.active', box).map(function (key, data) {
                    descList = descList.set($(data).html(), '<a class="list-group-item" href="javascript:void(0)">' + $(data).html() + '</a>');
                    $(data).removeClass('active');
                    $(data).addClass('disabled');
                  });
                  buildDesc();
                });
                $('#' + box_id + '-left').off('click').on('click', function () {
                  $('a.active', descBox).map(function (key, data) {
                    //console.log($(a).html());
                    //console.log($(data).html());
                    descList = descList.delete($(data).html());
                    $('a[data-value=' + $(data).html() + ']').removeClass('disabled');
                  });
                  buildDesc();
                });

                function buildDesc() {
                  if (descList && descList.size > 0) {
                    var descHTML = '';
                    descList.map(function (data, key) {
                      descHTML += data;
                    });
                    descBox.html(descHTML);
                    descBox.attr('data-mark', 'update');
                  } else {
                    descBox.html('');
                    descBox.attr('data-mark', 'update');
                  }
                  $('a', descBox).off('click').on('click', function () {
                    var cur_a = $(this);
                    if (!cur_a.hasClass('active')) {
                      cur_a.addClass('active');
                    } else {
                      cur_a.removeClass('active');
                    }
                  });

                }
              } else {

                var sourceList = box.attr('data-listbox-value');
                var sourceHTML = '';
                sourceList = Immutable.List(sourceList.split(','));
                sourceList.map(function (data, key) {
                  var className = 'list-group-item';
                  sourceHTML += '<a class="' + className + '" href="javascript:void(0)" data-value="' + data + '">' + data + '</a>';
                });
                box.html(sourceHTML);
                $('a', box).off('click').on('click', function () {
                  var cur_a = $(this);
                  if (!cur_a.hasClass('disabled')) {
                    if (!cur_a.hasClass('active')) {
                      cur_a.addClass('active');
                    } else {
                      cur_a.removeClass('active');
                    }
                  }
                });
              }

            });
          }
        }
        if (type == 'file') {
          //初始化文件上传事件
          var inputFiles = $('.input-group.input-group-file', contentBox);
          inputFiles.each(function (key) {
            var inputFileBox = $(inputFiles[key]);
            var inpuText = $('[type=text]', inputFileBox);
            var inputFile = $('[type=file]', inputFileBox);
            inputFile.on('change', function () {
              var url = $(this).val();
              if (typeof url != 'undefined' && url.length > 0)
                inpuText.val(url);
              inpuText.attr('data-mark', 'update');
            });
          });
        }
        if (type == 'model') {
          /**
           * model模式下的数据获取和分页事件
           */
          //console.log('initialize model');
          $('[data-model]', contentBox).map(function (key, data) {

            function trimInit() {
              var cur_model = $(data);
              var type = cur_model.attr('data-type');
              if (!type || type == 'one') {
                var trs = $('table tbody tr', cur_model);
                trs.off('click').on('click', function () {
                  trs.removeClass('active');
                  var cur_tr = $(this);
                  if (cur_tr.hasClass('active')) {
                    cur_tr.removeClass('active');
                  } else {
                    cur_tr.addClass('active');
                  }
                });
                trs.off('dblclick').on('dblclick', function () {
                  var cur_tr = $(this);
                  var cur_id = cur_model.attr('data-model');
                  var cur_box = $('#' + cur_id, contentBox);
                  cur_box.val(cur_tr.attr('data-value'));
                  if (cur_box.attr('data-mark')) {
                    cur_box.attr('data-mark', 'update');
                  }
                  cur_box.trigger('change');
                  $('[aria-label=Close]', data).trigger('click');
                });
              }
              else if (type == 'lot') {
                var trs = $('table tbody tr', cur_model);
                trs.off('click').on('click', function () {
                  //trs.removeClass('active');
                  var cur_tr = $(this);
                  if (cur_tr.hasClass('active')) {
                    cur_tr.removeClass('active');
                  } else {
                    cur_tr.addClass('active');
                  }
                });
                //trs.off('dblclick').on('dblclick', function() {
                //  var cur_tr = $(this);
                //  var cur_id = cur_model.attr('data-model');
                //  var cur_box = $('#'+cur_id, contentBox);
                //  cur_box.val(cur_tr.attr('data-value'));
                //  if(cur_box.attr('data-mark')) {
                //    cur_box.attr('data-mark', 'update');
                //  }
                //  $('[aria-label=Close]', data).trigger('click');
                //});

                $('#btn-selected').off('click').on('click', function () {
                  var value = '';
                  $('table tbody tr.active', cur_model).map(function (key, data) {
                    var active_tr = $(data);
                    value += active_tr.attr('data-value') + ',';
                  });
                  if (value) {
                    if (value.substr(value.length - 1) == ',')
                      value = value.substr(0, value.length - 1);
                    var cur_id = cur_model.attr('data-model');
                    var cur_box = $('#' + cur_id, contentBox);
                    cur_box.val(value);
                    if (cur_box.attr('data-mark')) {
                      cur_box.attr('data-mark', 'update');
                    }
                  }
                  $('[aria-label=Close]', data).trigger('click');


                });


              }
              $('[data-role=page]', cur_model).map(function(key, data) {
                $(this).off('click').on('click', function() {
                  var page = $(this).attr('data-page');
                  var url = cur_model.attr('data-url');
                  var fName = cur_model.attr('data-back');

                  url = _this.util.parseURLGet(url, [{key: 'page', value: page}]);

                  _this.AJAXGet(url)
                    .success(function(data) {
                      backs[fName](data, cur_model, trimInit);
                    })
                    .error(function(err) {

                    });
                  return false;
                });
              });
            }

            /**
             * 这里的判断主要是为了实现异步页面加载后的分页逻辑
             * 因为如果是异步,model里的数据根本就没有,所有这个时候初始化单击双击和分页事件都不可以的
             * 需要先加载一次数据然后在加载这些事件
             *
             * 第一个条件是判断这个model里的table里是否有数据,如果没有数据可能是异步的情况,就需要先加载数据
             * 第二个条件是进一步判断是否是异步,因为我的规则里异步的model都需要在model的box上绑定data-url属性(是为了分页)
             * 然后在同时满足这两个条件的时候就认为是异步分页逻辑,就需要先通过执行一个AJAX请求(默认第一页)获取数据后再执行事件绑定
             */
            if ($('table tbody tr', this).length === 0 && $(this).attr('data-url')) {
              var cur_model = $(this);
              var page = 1;
              var url = cur_model.attr('data-url');
              var fName = cur_model.attr('data-back');
              _this.AJAXGet(url)
                .success(function(data) {
                  backs[fName](data, cur_model, trimInit);
                })
                .error(function(err) {

                });
            }else {
              trimInit();
            }

          })
        }
        if (type == 'update') {

          $('[data-update]', contentBox).map(function (key, data) {
            var btn = $(this);
            var value = btn.attr('data-update');

            if (value == 'default') {
              btn.attr('data-mark', 'update');
            }
            if (value == 'disabled') {
              if (value == 'disabled') {
                btn.attr('data-mark', 'update');
                btn.attr('disabled', 'disabled');
              }
            }

          });
        }
        if (type == 'switchery') {
          $('[data-role=switchery]', contentBox).map(function (key, data) {
            if ($(this).attr('data-value') == 'true') {
              $(this).attr('checked', 'checked');
            }
            //
            new Switchery(this, {color: $.colors("primary", 600), size: 'small', disabled: 'false'});

          });
        }
        if (type == 'disabled') {
          $('[data-disabled]', contentBox).map(function (key, data) {
            $(this).attr('disabled', 'disabled');
          });
        }
        if (type == 'init') {
          $('[data-init]', contentBox).map(function(key, data) {
            var box = $(this);
            var type = box.attr('data-init');
            if (type === 'default') {
              $(data).attr('data-mark', 'update');
            }
            if(type === 'checked') {
              $(data).attr('data-mark', 'update');
              if (box.attr('type') === 'checkbox' || box.attr('type') === 'radio' ) {
                box.attr('checked', true);
              }
            }
            if(type === 'hidden') {
              box.hide();
            }
            if(type === 'value') {
              if(box.attr('type') === 'text') {
                box.val(box.attr('data-value'));
                box.attr('data-mark', 'update');
              }
            }
          });
        }
        if (type == 'child') {
          $('[data-child=default]', contentBox).on('change', function() {
            $('[data-group=' + $(this).attr('id') + ']').attr('data-mark', 'update');
          });
        }
        if (type == 'load') {
          $('[data-load=hide]', contentBox).hide();
        }
        if (type == 'password') {
          $('[data-password]', contentBox).map(function() {
            var btn = $('input', this);
            var ioc = $('span:first', this);
            ioc.off('click').on('click', function() {
              if(btn.val()) {
                if(btn.attr('type') === 'password') {
                  btn.attr('type', 'text');
                  $('span',ioc).attr('class', 'icon wb-eye');
                }else {
                  btn.attr('type', 'password');
                  $('span',ioc).attr('class', 'icon wb-eye-close');
                }
              }
            });
            btn.on('focus', function() {
              if (this.type === 'text') {
                this.type = 'password';
                $('span',ioc).attr('class', 'icon wb-eye-close');
              }
            });
          });
        }
        if (type == 'click') {
          /**
           * model模式下的初始化数据获取
           */
          $('[data-click]', contentBox).off('click').on('click', function() {
            var cur_radio = $(this);
            var cur_input = $('#' + cur_radio.attr('data-group'), contentBox);
            var cur_model = $('#' + cur_radio.attr('data-group'), contentBox).parent().find('span:first').attr('data-target')
            if (cur_model) cur_model = cur_model.substr(1, cur_model.length);
            if (!cur_input.val()) cur_input.val($('#'+ cur_model +' table tbody tr:first td:eq(1)').html());
          });
        }
      }
    }
  },
  changeContent: function (bodyClass, content, callback, url) {
    var body = $(document).find('body');
    //body.css('height','0');
    var contentBox = $('#content-box', body);
    if (bodyClass) {
      body.attr('class', bodyClass);
      //contentBox.html(content);
    }
    if (content != null && typeof content != 'undefined') {
      contentBox.html(content);
      //contentBox.replaceWith(content);
    }
    //if (typeof callback === 'function')
    //    callback($('#content-box', body));
    //$('#content-box').animsition('init').animsition('pageIn');

    //page animsition
    var content = $('.page.animsition', contentBox);
    if (content && content.length > 0) {
      content.animsition('init').animsition('pageIn');
    } else {
      content = contentBox;
    }


    if (typeof callback === 'function')
      callback(content);


    //统一绑定返回事件
    var _this = this;
    $('[data-return]', content).on('click', function () {
      _this.menuDescribe[$(this).attr('data-return')](_this);
    });
    //初始化select
    $('[data-role=select]', content).selectpicker({style: 'btn dropdown-toggle btn-select'});

  },
  get: function (url, callback, className) {

    var _this = this;
    _this.clear(_this);

    if (url.indexOf('access_token') <= 0) {
      var token = $.cookie('access_token');
      if (url.indexOf('?') >= 0) {
        url += '&access_token=' + token;
      } else {
        url += '?access_token=' + token;
      }
    }

    $.get(url, function (data) {

      if (data && data.result == 'TIME_OUT') {
        window.location = data.url;
        return;
      }
      if (data && data.err_code) {
        _this.show('error', data.msg, function () {
          if (data.url)
            window.location = data.url;
        });
        return;
      }
      _this.changeContent(className, data, callback, url);

    });

  },
  AJAXGet: function (url) {
    if (url.indexOf('access_token') <= 0) {
      var token = $.cookie('access_token');
      if (url.indexOf('?') >= 0) {
        url += '&access_tokenaccess_token=' + token;
      } else {
        url += '?access_token=' + token;
      }
    }
    function Post() {
      var _Post = this;
      $.ajax({
        type: 'GET',
        url: url,
        //data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
          _Post.success.call(this, data);
        },
        error: function (err) {
          _Post.error.call(this, err);
        },
      });
    }

    Post.prototype.constructor = Post;
    Post.prototype.success = function (func) {
      this.success = func;
      return this;
    };
    Post.prototype.error = function (func) {
      this.error = func;
      return this;
    };

    return new Post();

  },
  AJAXPost: function (url, data) {

    function Post() {
      var _Post = this;
      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
          _Post.success.call(this, data);
        },
        error: function (err) {
          _Post.error.call(this, err);
        },
      });
    }

    Post.prototype.constructor = Post;
    Post.prototype.success = function (func) {
      this.success = func;
      return this;
    };
    Post.prototype.error = function (func) {
      this.error = func;
      return this;
    };

    return new Post();

  },
  Eventproxy: function () {
    return new EventProxy();
  },
  UploadFile: function (url, fileData) {

    function Upload() {
      var formData = new FormData();
      formData.append(fileData.name, fileData);

      var _Upload = this;
      var xhr = new XMLHttpRequest();
      xhr.open("post", url, true);
      xhr.onload = function (data) {
        var result = data.currentTarget.response;
        try {
          result = JSON.parse(result);
        } catch (err) {
          result = {error: 'parse error'};
        }
        _Upload.success.call(this, result);
      };
      xhr.send(formData);
    }

    Upload.prototype.constructor = Upload;
    Upload.prototype.success = function (func) {
      this.success = func;
      return this;
    };
    Upload.prototype.error = function (func) {
      this.error = func;
      return this;
    };

    return new Upload();
  },
  clear: function (_this) {
    /*
     该方法为清理方法，主要清理定时或者后台更新程序，避免浏览器卡顿或者占用内存过高情况
     */
    if (_this.resources.cmi && _this.resources.cmi.timers && _this.resources.cmi.timers.length > 0) {
      _this.resources.cmi.timers.forEach(function (timer) {
        clearInterval(timer);
        //timer = null;
      });
      _this.resources.cmi.timers.length = 0;
    }
  },
  ready: function (marks, container) {
    var _this = this;
    /**
     * 参数列表构建
     */
    var obj = {};
    lookChildren(obj, marks);


    function lookChildren(obj, marks) {
      var o = obj;
      if (marks.name != "default") {
        obj[marks.name] = {};
        o = obj[marks.name];
      }
      if (marks.ids) {
        marks.ids.forEach(function (mark) {
          if (mark.describe) {
            //o[id.describe] = '666';
            //console.log(mark.id)
            if (mark.id) {
              if (typeof mark.id == 'string') {
                var value = trimBox(mark.id, mark.type);
                //console.log('read: '+ value);
                if (value != undefined && value != '$_default') {
                  if (mark.type) {
                    if (mark.type == 'Number') {
                      value = parseInt(value);
                    }
                    if (mark.type == 'Array') {
                      value = value.split(',');
                    }
                    if (mark.type == 'Float') {
                      value = parseFloat(value);
                    }

                  }
                  //待补充其他类型
                }


                //_this.util.isNull(value)
                if (value != '$_default') {
                  //o[mark.describe] = value || {};
                  o[mark.describe] = value;
                }
              } else if (typeof mark.id == 'object' && $.isArray(mark.id)) {
                var value_array = new Array();

                mark.id.map(function (data, key) {
                  //这里是否要考虑类型的问题？
                  var value;
                  if (data.id) {
                    value = trimBox(data.id);

                    /**
                     * 修改为不判断是否是$_default
                     */
                    //if (value === '$_default' && data.default) value = data.default || '';
                    if(!_this.util.isNull(value)) {
                      if (data.default || data.default === 0) value = data.default || '';
                    }
                    if (value && data.type) {
                      if (data.type === 'Number') {
                        value = !isNaN(value)?parseInt(value):0;
                      }
                      //...
                    }
                  } else {
                    value = trimBox(data);
                  }
                  //if(data.id && data.type) {
                  //  value = trimBox(data.id);
                  //  if( data.type === 'Number') {
                  //    value = parseInt(value);
                  //  }
                  //}else {
                  //  value = trimBox(data);
                  //}
                  if (_this.util.isNull(value)) {
                    if (value === ' ') value = '';
                    value_array[key] = value;
                  }
                });
                if (_this.util.isNull(value_array)) {
                  o[mark.describe] = value_array;
                }
              }

            } else if (mark.name) {
              var box = $('input[name=' + mark.name + ']:checked', container);
              if (box && !box.attr('data-lot')) {
                if (box.attr('data-mark') == 'update') {
                  var type = box.attr('type');
                  if (type) {
                    if (type == 'radio') {
                      if (mark.type && mark.type == 'group') {
                        /**
                         * radio 的值统一转换为数字，如果将来这里出现非数字的情况，可以考虑
                         */
                        var radioValue = box.val();
                        if (radioValue !== '' && !isNaN(radioValue)) {
                          radioValue = parseInt(radioValue);
                        }
                        o[mark.describe[0]] = radioValue;
                        //o[mark.describe[1]] =
                        if (box.attr('data-associated') == 'default') {
                          // End Call 情况下第二个值赋值为 “”
                          if (box.attr('data-group') === 'default') {
                            o[mark.describe[1]] = "";
                          } else {
                            var child = $('#' + box.attr('data-group'), container);
                            /**
                             * 是否给子元素添加操作控制？
                             * && child.attr('data-mark') == 'update'
                             */
                            if (child) {
                              var type = child.attr('type');
                              if (!type) {
                                type = child.attr('data-role');
                              }
                              if (type == 'text' || type == 'select' || type === 'hidden') {
                                o[mark.describe[1]] = child.val();
                              }
                            }
                          }

                        }
                      } else {
                        /**
                         * 获取非关联性 radio 值
                         */
                        var radioValue = box.val();
                        if (radioValue !== '' && !isNaN(radioValue)) {
                          radioValue = parseInt(radioValue);
                        }
                        o[mark.describe] = radioValue;
                      }
                    } else if (type == 'update') {
                      console.log('update 5666666');
                    }
                  }
                }
              } else if (box && box.attr('data-lot') == 'default') {
                var box_values = [];
                var bool = false;
                for (var index = 0; index < box.size(); index++) {
                  var cur_box = $(box[index]);
                  //选中就不判断data-mark了吧 。。
                  var type = cur_box.attr('type');
                  //这里添加bool属性的目的是 当 多个checkbox的时候如果修改了其中一个，那么久需要提交所有的
                  //否则不提交
                  if (cur_box.attr('data-mark') == 'update') {
                    bool = true;
                  }
                  if (type == 'checkbox') {
                    box_values.push(cur_box.val());
                  }
                  //...
                }
                if (box_values && box_values.length > 0 && bool) {
                  o[mark.describe] = box_values;
                }
              }

              //$('input[name='+mark.name+'] [data-mark=update]')
            }

            if (!o[mark.describe]) {
              var type = mark.default;
              if (type == 'array') {
                o[mark.describe] = [];
              }
            }
          }
        });
      }
      if (marks.children) {
        marks.children.forEach(function (child) {
          //console.log(child);
          lookChildren(o, child);
        });
      }

      if (_this.util.isEmptyObject(obj[marks.name])) {
        delete obj[marks.name];
      }


    }

    function trimBox(id, type) {
      //console.log(mark.id);

      var result = '$_default';
      var box = $("#" + id, container);
      if (box.attr('data-mark') == 'update') {
        //console.log(mark.id);
        var type = box.attr('type');
        if (!type) {
          type = box.attr('data-role');
        }
        if (type == 'text' || type == 'textarea' || type == 'hidden' || type === 'password') {
          /**
           * 取消空值判断 当update清空某个值得情况
           */
          //if (box && box.val()) {
          //  //o[describe] = box.val();
          //  //return box.val();
          //  result = box.val();
          //  //console.log(o);
          //}
          result = box.val();

        }
        if (type == 'checkbox') {
          //o[describe] = box.is(':checked');
          //return box.is(':checked');
          result = box.is(':checked');
          if (box.attr('data-reverse')) {
            result = !result;
          }
        }
        if (type == 'select') {
          //if (box.val() !== '0') {
          //  //o[describe] = box.val();
          //  //return box.val();
          //  result = box.val();
          //}
          result = box.val();
        }
        if (type == 'list') {
          var childs = $('a', box);
          if (childs && childs.size()) {
            //o[describe] = [];
            var value_array = new Array();
          }
          for (var i = 0; i < childs.size(); i++) {
            var a = $(childs[i]);
            //o[describe][i] = a.html()
            value_array[i] = a.html();
          }
          //return value_array;
          result = value_array;
        }
        if (type == 'listbox') {
          var actives = [];
          $('a', box).map(function (key, data) {
            actives[key] = $(data).html();
          });
          /**
           * 处理数组为空需清空数据库的情况
           */
          if (actives && actives.length > 0) {
          }
          //o[describe] = actives;
          //return actives;
          result = actives;
        }
        //...
      }
      return result;
    }

    return obj;
  },
  show: function (type, msg, callBack) {
    toastr[type](msg, '', {
      closeButton: true,
      showMethod: "slideDown",
      // positionClass: "toast-top-full-width",
      positionClass: "toast-top-center",
      containerId: "toast-topFullWidth",
      onHidden: typeof callBack == 'function' ? callBack : undefined,
    });

  },
  util: {
    parseJSON: function (str) {
      var result = '';

      if (str && typeof str == 'object' && Object.prototype.toString.call(str).toLowerCase() == '[object object]') {
        result = str;
      } else if (str && typeof str == 'string' && str.indexOf('{') == 0 && str.lastIndexOf('}') == str.length - 1) {
        result = JSON.parse(str);
      } else {
        var result = {
          err_code: '500',
          msg: 'Abnormal returns the result format -- ' + str
        }

      }

      return result;
    },
    parseURLGet: function (url, option) {
      var result = url;
      var token = $.cookie('access_token');
      if (token) {
        result += '?access_token=' + token;
      } else {
        //...
        console.log('no token ??????')
      }

      if (option && option.length > 0) {
        //if(result && result.substr(result.length-1,result.length) == '?') {
        //    result += '&'
        //}
        result += '&';
        if (typeof option.forEach == 'function') {
          var pars = '';
          option.forEach(function (obj) {
            if (obj.value)
              pars += obj.key + '=' + encodeURIComponent(obj.value) + '&';
          });
          result += pars;
        }

        if (result && result.substr(result.length - 1, result.length)) {
          result = result.substr(0, result.length - 1);
        }

      }

      return result;
    },
    parseURLPost: function (data, option) {
      var token = $.cookie('access_token');
      if (data) {
        data.access_token = token;
      }

      return data;
    },
    isNull: function (str) {
      if (str || str === 0) {
        if (typeof str == 'string' && str !== '' && str !== null && str.length > 0 && str !== '$_default') {
          return true;
        } else if ($.isArray(str) && str.length > 0) {
          return true;
        } else if (!isNaN(str)) {
          return true;
        }
      }
      return false;
    },
    isEmptyObject: function isEmptyObject(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    },
    trimValue: function (data, option, key) {
      //console.log(data+':'+option);
      var result = data;
      if (data && option) {
        if (typeof option.forEach == 'function') {
          option.forEach(function (para) {

            //&& result[para] != 'false'
            if (result[para] != undefined) {
              result = result[para];
            } else {
              result = '';
            }
          });
        }
      }
      if(result && result !='' && Array.isArray(result) && (key || key === 0)) {
        result = result[key];
      }
      return result;
    },
    trimDate: function (data, option, fmt) {
      //console.log(data+':'+option);
      var result = data;
      if (data && option) {
        if (typeof option.forEach == 'function') {
          option.forEach(function (para) {

            //&& result[para] != 'false'
            if (result[para] != undefined) {
              result = result[para];
            } else {
              result = '';
            }
          });
        }
      }
      return moment(result * 1000).format(fmt);
    },
  },
  backs: {
    extension: function(data, content, back) {

      if(data && data.extensions && data.count > 0) {
        var html = '';
        data.extensions.map(function(data, key) {

          html += '<tr data-value="' + data.extension_number + '">';
          html += '<td>' + (key + 1) + '</td>';
          html += '<td>' + data.extension_number + '</td>';
          html += '<td>' + data.extension_number + '</td>';
          html += '<td>' + data.first_name + ' ' + data.last_name + '</td>';
          html += '<td>' + data.email + '</td>';
          html += '</tr>';

        });
        $('table tbody', content).html(html);
      }

      var pageData = {colsPanNumber: 4, showNumber: 5, page_current: data.page, page_count: data.page_sum};
      var pageHtml = ejs.render(data.pageStr, pageData);
      $('table tfoot', content).html(pageHtml);
      back();

    },
  },
  holdMenu: function (li, _this) {

    var menuType = li.attr('data-menu');


    switch (menuType) {
      case 'h':
        _this.menuDescribe['h'](_this);
        break;
      case 'api':
        _this.menuDescribe['api'](_this);
        break;
      case 'cmi':
        _this.menuDescribe['cmi'](_this);
        break;
      case 'dat':
        _this.menuDescribe['dat'](_this);
        break;
      case 'ph':
        _this.menuDescribe['ph'](_this);
        break;
      case 'ex':
        _this.menuDescribe['ex'](_this);
        break;
      case 'gm':
        _this.menuDescribe['gm'](_this);
        break;
      case 'sex':
        _this.menuDescribe['sex'](_this);
        break;
      case 'vpt':
        _this.menuDescribe['vpt'](_this);
        break;
      case 'ir':
        _this.menuDescribe['ir'](_this);
        break;
      case 'or':
        _this.menuDescribe['or'](_this);
        break;
      case 'rg':
        _this.menuDescribe['rg'](_this);
        break;
      case 'vr':
        _this.menuDescribe['vr'](_this);
        break;
      case 'cq':
        _this.menuDescribe['cq'](_this);
        break;
      case 'co':
        _this.menuDescribe['co'](_this);
        break;
      case 'cs':
        _this.menuDescribe['cs'](_this);
        break;
      case 'vm':
        _this.menuDescribe['vm'](_this);
        break;
      case 'con':
        _this.menuDescribe['con'](_this);
        break;
      case 'te':
        _this.menuDescribe['te'](_this);
        break;
      case 'rm':
        _this.menuDescribe['rm'](_this);
        break;
      case 'cr':
        _this.menuDescribe['cr'](_this);
        break;
      case 'bi':
        _this.menuDescribe['bi'](_this);
        break;
      case 'st':
        _this.menuDescribe['st'](_this);
        break;
      case 'ms':
        _this.menuDescribe['ms'](_this);
        break;
      case 'cse':
        _this.menuDescribe['cse'](_this);
        break;
      case 'ss':
        _this.menuDescribe['ss'](_this);
        break;
      case 'nb':
        _this.menuDescribe['nb'](_this);
        break;
      case 'li':
        _this.menuDescribe['li'](_this);
        break;
      case 'pf':
        _this.menuDescribe['pf'](_this);
        break;
    }


  },
  menuDescribe: {
    h: function (_this) {


      _this.resources.cmi = _this.resources.cmi || {};

      _this.resources.cmi.refreshTime = _this.resources.cmi.refreshTime || 1000 * 60;
      _this.resources.cmi.timers = _this.resources.cmi.timers || [];
      //_this.resources.cmi.charts = _this.resources.cmi.charts || [];

      var charts = {};


      function getTime() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return hours + ':' + minutes + ':' + seconds;
      }

      function updateChart(contentBox) {

        if (charts.callTimer) {
          if (charts.callTimer['datasets'][0].points.length > 10) {
            charts.callTimer.removeData();
          }
          var number = Math.floor(Math.random() * 20);
          //var time = getTime();

          $('#current-calls-number', contentBox).html(number);
          charts.callTimer.addData([number], '');
        }
        if (charts.extensionsTimer) {
          if (charts.extensionsTimer['datasets'][0].points.length > 10) {
            charts.extensionsTimer.removeData();
          }
          var number = Math.floor(Math.random() * 20);
          //var time = getTime();
          $('#current-extensions-number', contentBox).html(number);
          charts.extensionsTimer.addData([number], '');
        }
        if (charts.resourceTimer) {
          if (charts.resourceTimer['datasets'][0].points.length > 10) {
            charts.resourceTimer.removeData();
          }
          var number1 = Math.floor(Math.random() * 100);
          var number2 = Math.floor(Math.random() * 100);
          //var time = getTime();
          $('#current-cpu-number', contentBox).html(number1 + '%');
          $('#current-memory-number', contentBox).html(number2 + '%');

          charts.resourceTimer.addData([number1, number2], '');
        }


      }

      function startTimers(contentBox) {

        //if (_this.resources.cmi.timers.length > 0) {
        //    stopTimers();
        //}
        _this.resources.cmi.timers.push(setInterval(function () {
          updateChart(contentBox);
        }, _this.resources.cmi.refreshTime));

      }

      //function stopTimers() {
      //    if (_this.resources.cmi.timers && _this.resources.cmi.timers.length > 0) {
      //        _this.resources.cmi.timers.forEach(function (timer) {
      //            clearInterval(timer);
      //            //timer = null;
      //        });
      //        _this.resources.cmi.timers.length = 0;
      //    }
      //}

      _this.get('/main', function (contentBox) {

        var chartBoxs = $('[name=chart-line-box]', contentBox);
        //$('#exampleChartjsLine', lineBox).css('width',lineBox.width());

        chartBoxs.each(function (key) {
          var box = $(chartBoxs[key]);
          $('canvas', box).css('width', box.width());
          //$('canvas',box).css('height', box.width()/3);
        });


        //首页图标初始化
        var lineChartData = {
          labels: [''],
          scaleShowGridLines: true,
          scaleShowVerticalLines: false,
          scaleGridLineColor: "#ebedf0",
          datasets: [{
            fillColor: "rgba(98, 168, 234, .1)",
            strokeColor: $.colors("primary", 600),
            pointColor: $.colors("primary", 600),
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: $.colors("primary", 600),
            data: [0]
          }]
        };
        var resourceLineChartData = {
          labels: [''],
          scaleShowGridLines: true,
          scaleShowVerticalLines: false,
          scaleGridLineColor: "#ebedf0",
          datasets: [
            {
              fillColor: "rgba(204, 213, 219, .1)",
              strokeColor: $.colors("blue-grey", 300),
              pointColor: $.colors("blue-grey", 300),
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: $.colors("blue-grey", 300),
              data: [0]
            }, {
              fillColor: "rgba(98, 168, 234, .1)",
              strokeColor: $.colors("primary", 600),
              pointColor: $.colors("primary", 600),
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: $.colors("primary", 600),
              data: [0]
            }]
        };

        var callTimer = new Chart($('#line-calls')[0].getContext("2d")).Line(lineChartData);
        var extensionsTimer = new Chart($('#line-extensions')[0].getContext('2d')).Line(lineChartData);
        var resourceTimer = new Chart($('#line-resource')[0].getContext('2d')).Line(resourceLineChartData);

        charts.callTimer = callTimer;
        charts.extensionsTimer = extensionsTimer;
        charts.resourceTimer = resourceTimer;


        startTimers(contentBox);



        $('#test-show-wizards').off('click').on('click', function() {

          _this.get('/wizards/one', function(contentBox) {

            _this.initialize(contentBox);

          });

        });

        /*
         *  动态获取NEWS信息
         */
        _this.AJAXGet('/main/news')
          .success(function(data) {
            if (data && data.news) {
              var newsHTML = '';
              newsHTML += '<h3 class="margin-0">News</h3>';
              data.news.map(function(data) {
                newsHTML += '<h5 class="padding-left-20"><a target="_blank" href="' + data.url + '">' + data.title +
                  '</a></h5>';
              });
              $('#main-news', contentBox).html(newsHTML);
            }
          });

        /*
         * 向导事件
         */
        $('#main-wizard', contentBox).off('click').on('click', function() {
          _this.wizard(_this, 'main');
        });
      });


    },
    api: function (_this) {
      $.get('/api', function (data) {
        var bodyClass = 'page-faq site-menubar-unfold';
        _this.changeContent(bodyClass, data, function () {
          $.getScript('/javascripts/solomon/pages/faq.js');
        });
      });
    },
    cmi: function (_this) {

      _this.get('/callManager/information', function (contentBox) {



      }, 'site-menubar-unfold');
    },
    ph: function(_this) {
      _this.get('/callManager/phones', function(contentBox) {

        $('#ph-add-extension').on('click', function(){
          
          var tds = $(this).parent().parent().find('td');
          var model = $(tds[1]).html();
          var mac = $(tds[6]).html();
          
          _this.menuDescribe['ex'](_this, 1, function(functions) {
            functions.create({model: model, mac: mac});
          });
        });


      });
    },
    ex: function (_this, page, back) {
      page = page || 1;
      //console.log(page);
      var url = '/callManager/extension';
      //console.log(url);

      url = _this.util.parseURLGet(url, [{key: 'page', value: page}]);
      console.log(url);

      var paras = {
        name: "default",
        ids: [
          {id: "eg-number", describe: "extension_number"},
          {id: "eg-password", describe: "password"},

          {id: "eo-extension-groups", describe: "belong_groups"}
        ],
        children: [
          {
            name: "profile",
            ids: [
              {id: "eg-first-name", describe: "first_name"},
              {id: "eg-last-name", describe: "last_name"},
              {id: "eg-gender", describe: "gender"},
              {id: "eg-email", describe: "email"},
              {id: "eg-company-name", describe: "company_name"},
              {id: "eg-company-website", describe: "company_website"},
              {id: "eg-mobile-phone", describe: "mobile_phone"},
              {id: "eg-work-phone", describe: "work_phone"},
              {id: "eg-home-phone", describe: "home_phone"},
              {id: "eg-twitter", describe: "twitter"},
              {id: "eg-facebook", describe: "facebook"},
              {id: "eg-gender-linked", describe: "linkedin"},
              {id: "eg-instagram", describe: "instagram"},
              {id: "eg-description", describe: "description"}
            ]
          },
          {
            name: "voice_mail",
            ids: [
              {id: "evm-enable", describe: "enable_voicemail"},
              {id: "evm-prompt-language", describe: "prompt_language"},
              {id: "evm-pin-auth", describe: "enable_vm_pin_auth"},
              {id: "evm-pin-number", describe: "voicemail_pin"},
              {id: "evm-call-id", describe: "enable_play_caller_id"},
              {id: "evm-read-out", describe: "msg_read_out_datetime", type: 'Number'}

              //{id: "", describe: "default_greeting_file"},
              //{id: "", describe: "greeting_files"}
            ]
          },
          {
            name: "forward_rules",
            children: [
              {
                name: "available",
                ids: [
                  {id: "ea-timeval", describe: "no_answer_timeval", type: 'Number'},
                  {
                    name: "ea-radio-answer",
                    type: "group",
                    describe: ["no_answer_action", "no_answer_action_value"]
                  },
                  {
                    name: "ea-radio-busy",
                    type: "group",
                    describe: ["busy_action", "busy_action_value"]
                  }
                ]
              },
              {
                name: "offline",
                ids: [
                  {
                    name: "eo-radio-in-office",
                    type: "group",
                    describe: ["office_hours_action", "office_hours_action_value"]
                  },
                  {
                    name: "eo-radio-outside-office",
                    type: "group",
                    describe: ["outside_office_hours_action", "outside_office_hours_action_value"]
                  }
                ]
              },
              {
                name: "dnd",
                ids: [
                  {
                    name: "ed-radio-in-office",
                    type: "group",
                    describe: ["office_hours_action", "office_hours_action_value"]
                  },
                  {
                    name: "ed-radio-outside-office",
                    type: "group",
                    describe: ["outside_office_hours_action", "outside_office_hours_action_value"]
                  }
                ]
              },
              {
                name: "away",
                ids: [
                  {
                    name: "eaw-radio-in-office",
                    type: "group",
                    describe: ["office_hours_action", "office_hours_action_value"]
                  },
                  {
                    name: "eaw-radio-outside-office",
                    type: "group",
                    describe: ["outside_office_hours_action", "outside_office_hours_action_value"]
                  }
                ]
              }
            ]
          },
          {
            name: "options",
            ids: [
              {id: "eo-record-calls", describe: "record_all_calls"},
              {id: "eo-disable-extension", describe: "enable_extension"},
            ]
          },
          {
            name: "office_hours",
            ids: [
              {name: "eoh-uses-time", describe: "office_hours_mode"},
              {id: "eoh-monday-begin", describe: "monday_from"},
              {id: "eoh-monday-end", describe: "monday_to"},
              {id: "eoh-tuesday-begin", describe: "tuesday_from"},
              {id: "eoh-tuesday-end", describe: "tuesday_to"},
              {id: "eoh-wednesday-begin", describe: "wednesday_from"},
              {id: "eoh-wednesday-end", describe: "wednesday_to"},
              {id: "eoh-thursday-begin", describe: "thursday_from"},
              {id: "eoh-thursday-end", describe: "thursday_to"},
              {id: "eoh-friday-begin", describe: "friday_from"},
              {id: "eoh-friday-end", describe: "friday_to"},
              {id: "eoh-saturday-begin", describe: "saturday_from"},
              {id: "eoh-saturday-end", describe: "saturday_to"},
              {id: "eoh-sunday-begin", describe: "sunday_from"},
              {id: "eoh-sunday-end", describe: "sunday_to"}
            ]
          },
          {
            name: "phone_provisioning",
            ids: [
              {id: "epp-phone-model", describe: "phone_model"},
              {id: "epp-mac-address", describe: "phone_mac_address"},
              {id: "epp-page-password", describe: "phone_webpage_password"},
              {id: "epp-time-zone", describe: "time_zone"},
              {id: "epp-display-language", describe: "phone_display_language"},
              {id: "epp-provisioning-method", describe: "phone_provisioning_method"},
              {id: "epp-networkd-interface", describe: "network_interface"},
              {id: "epp-codec-st", describe: "first_preferred_codec"},
              {id: "epp-codec-nd", describe: "second_preferred_codec"},
              {id: "epp-codec-rd", describe: "third_preferred_codec"},
              {id: "epp-codec-th", describe: "fourth_preferred_codec"}
            ]
          }
        ]
      };

      function init(contentBox, option) {
        /*
         选项卡折叠事件暂不添加，待有需求时添加即可
         现在只有3个选项卡，手机屏幕现实没太大问题，如果将来要继续添加或者别的地方有使用到多个，可以参考这里的代码
         */
        ////$.getScript('/javascripts/plugins/responsive-tabs.js', function () {
        ////    //。。。
        ////});
        //
        //
        //$('#eoh-radio-time-global', contentBox).on('click', function () {
        //  //data-role="timepicker"
        //  $('[data-role=timepicker]', contentBox).attr('data-mark', 'default').val('').attr('readonly', 'readonly');
        //  $('[data-time-show=default]').val('');
        //});
        /**
         * Office Hours 页签 时间控件初始化
         */
        $('#eoh-radio-time-specific', contentBox).on('click', function () {
          $('[data-role=timepicker]', contentBox).removeAttr('readonly');
        });
        /**
         * Office Hours 选项卡时间控件
         */
        $('[data-role=timepicker]', contentBox).timepicker({'scrollDefault': 'now', timeFormat: 'H:i'});
        $('[data-time-add]', contentBox).on('click', function () {
          var timeId = $(this).attr('data-time-add');

          var begin = $('#' + timeId + '-begin').attr('data-mark', 'update').val();
          var end = $('#' + timeId + '-end').attr('data-mark', 'update').val();

          $('#' + timeId).val(begin + ' - ' + end);
        });
        $('[data-time-remove]', contentBox).on('click', function () {
          var timeId = $(this).attr('data-time-remove');
          $('#' + timeId).val('');
          $('#' + timeId + '-begin').attr('data-mark', 'default').val('');
          $('#' + timeId + '-end').attr('data-mark', 'default').val('');

        });

        // greetingFile
        $('#gfsBox tr td', contentBox).off('click').on('click', function () {
          $('#gfsBox tr td', contentBox).removeClass('active');
          $(this).addClass('active');
        });
        $('#gfs-input-del', contentBox).off('click').on('click', function () {
          var td = $('#gfsBox tr td.active', contentBox);
          if (td.size() === 0) {
            _this.show('error', 'Please select an audio');
            return;
          }
          var ex_number = $('#eg-number', contentBox).val();
          if (_this.util.isNull(ex_number)) {
            var reqJSON = {
              extension_number: ex_number,
              filename: td.attr('data-key'),
            };
            _this.AJAXPost('/callManager/extension/greeting/delete', reqJSON)
              .success(function () {
                _this.show('success', 'Operation is successful');
                td.parent().remove();
              })
              .error(function () {
                _this.show('error', 'The operation failure');
              });
          }

        });
        $('#gfs-input-set', contentBox).off('click').on('click', function () {
          var td = $('#gfsBox tr td.active', contentBox);
          if (td.size() === 0) {
            _this.show('error', 'Please select an audio');
            return;
          }
          var ex_number = $('#eg-number', contentBox).val();
          if (_this.util.isNull(ex_number)) {
            var reqJSON = {
              extension_number: ex_number,
              filename: td.attr('data-key'),
            };
            _this.AJAXPost('/callManager/extension/greeting/update', reqJSON)
              .success(function () {
                _this.show('success', 'Operation is successful');
                //td.parent().remove();
              })
              .error(function () {
                _this.show('error', 'The operation failure');
              });
          }

        });
        $('#gfs-input-update', contentBox).off('click').on('click', function () {
          var td = $('#gfsBox tr td.active', contentBox);
          if (td.size() === 0) {
            _this.show('error', 'Please select an audio');
          }
        });

        // extension add/update 功能异步获取依赖数据(考虑到当有数据获取不到的情况的时候整体页面无法显示的问题)
        $('#ex-tab-forwarding', contentBox).off('click').one('click', function () {
          var ep = _this.Eventproxy();
          ep.all('rgsData', 'vrsData', function (rgsData, vrsData) {
            var newOptions = [];
            if (Array.isArray(option) && option.indexOf('select') >= 0) {
              // _this.initialize(contentBox, ['checkbox']);
              newOptions.push('checkbox');
              //
            }
            newOptions.push('model');
            newOptions.push('click');
            _this.initialize(contentBox, newOptions, {extension: _this.backs.extension});
            // var modelExtensionHTML = ejs.render(exHTML.extensionHTMLDate, {esData: exData});
            //
            // console.log(modelExtensionHTML);

            $('#ex-loading').addClass('hide');
          });

          // _this.AJAXGet('/callManager/extension/list')
          //   .success(function (data) {
          //     if (data && data.extensions) {
          //       var options = '';
          //       data.extensions.map(function (data, key) {
          //         options += '<option value="' + data.extension_number + '">' + data.extension_number + '</option>';
          //       });
          //       $('[name=ex-extension-select]').html(options).selectpicker('refresh');
          //       ep.emit('exsData', data);
          //     }
          //   })
          //   .error(function (err) {
          //     console.log(err);
          //   });
          _this.AJAXGet('/callManager/ringGroups/list')
            .success(function (data) {
              if (data && data.groups) {
                var options = '';
                data.groups.map(function (data, key) {
                  options += '<option value="' + data.ring_group_number + '">' + data.ring_group_number + '</option>';
                });
                $('[name=ex-ringgroup-select]').html(options).selectpicker('refresh');
                ep.emit('rgsData', {});
              }
            })
            .error(function (err) {
              console.log(err);
            });

          _this.AJAXGet('/callManager/virtualReceptionist/list')
            .success(function (data) {
              if (data && data.virtual_receptionists) {
                var options = '';
                data.virtual_receptionists.map(function (data, key) {
                  options += '<option value="' + data.virtual_receptionist_number + '">' + data.virtual_receptionist_number + '</option>';
                });
                $('[name=ex-receptionist-select]').html(options).selectpicker('refresh');
                ep.emit('vrsData', {});
              }
            })
            .error(function (err) {
              console.log(err);
            });
          // _this.AJAXGet('/callManager/extension/model/extension')
          //   .success(function (data) {
          //     ep.emit('exHTML', data);
          //   });
          //*****************************
        });
        // phone provisioning 异步获取数据
        $('#ex-tab-phone-provisioning', contentBox).one('click', function(){
          _this.AJAXGet('/callManager/extension/phone/models')
            .success(function(data) {
              $('#ex-pp-loading').hide();
              initPhone(data);
            });
          function initPhone(data) {
            if(data && data.models && data.models.length > 0) {

              // console.log(data.models);
              var modelOptions = '';
              var timezonesOption = '';
              var modelSelectBox = $('#epp-phone-model', contentBox);
              var value = modelSelectBox.attr('data-selected');
              data.models.map(function(data, key) {
                for(var modelType in data) {
                  try {
                    var models = data[modelType].doc.header[0].models[0].model;
                    models.map(function(model, key) {
                      var displayName = model['_'] || (model['$'] && model['$'].ua) || model;
                      // 这里注意对比的值 xml里的model有两个值 这里对比的显示的值,
                      // 如果需要对比真实的值修改dissplayName为modelType
                      if (value && value === displayName) {
                        modelOptions += '<option value="'+ modelType +'" selected>' + displayName + '</option>';
                      }else {
                        modelOptions += '<option value="'+ modelType +'">' + displayName + '</option>';
                      }
                    });
                  }catch(err) {
                    console.log(err);
                    console.log('PhoneModels Invalid Format', err);
                  };

                }
              });
              modelSelectBox.html(modelOptions).on('change', function() {
                changeModel($(this).val(), data);
              }).selectpicker('refresh').trigger('change');
            }
          }
          function changeModel(type, data) {

            var models = data.models.filter(function(m) {
              return m[type];
            });

            // 加载TimeZone
            var timezones = models[0][type].doc.header[0].timezoneParams[0];
            var timezonesOption = '';
            if (timezones && Array.isArray(timezones.option)) {
              timezones.option.map(function(data, key) {
                var displayName =  data['_'] ||data['$'].value;
                timezonesOption += '<option>' + displayName + '</option>'
              });
            }
            $('#epp-time-zone').html(timezonesOption).selectpicker('refresh');

            // 加载Language
            var languages = models[0][type].doc.header[0].languages[0];
            var languagesOption = '';
            if (languages && Array.isArray(languages.option)) {
              languages.option.map(function(la, key) {
                languagesOption += '<option>' + la['$'].value + '</option>';
              });
            }
            $('#epp-display-language', contentBox).html(languagesOption).selectpicker('refresh');

            //  加载Provisioning Method
            var allowedNetwork = models[0][type].doc.header[0].AllowedNetworkConfig[0];
            var allowedNetworkOption = '';
            if (allowedNetwork && Array.isArray(allowedNetwork.option)) {
              allowedNetwork.option.map(function(config, key) {
                var value = config['_'];
                var type = config['$'].value;
                if(value === '1') {
                  switch (type) {
                    case 'LOCALLAN' :
                      allowedNetworkOption += '<option value="LOCALLAN">'+ 'Local Lan (In the Office)' +'</option>';
                      break;
                    case 'REMOTESTUN' :
                      allowedNetworkOption += '<option value="REMOTESTUN">'+ 'Remote Extension (STUN)' +'</option>';
                      break;
                    case 'SBC' :
                      allowedNetworkOption += '<option value="SBC">'+ '3CX Session Border Controller' +'</option>';
                      break;
                  }
                }
              });
              $('#epp-provisioning-method', contentBox).html(allowedNetworkOption).selectpicker('refresh');
            }

            //加载code
            var codes = models[0][type].doc.header[0].Codecspriorities[0];
            if (codes && Array.isArray(codes.Codecspriority)) {
              var code1Box = $('#epp-codec-st', contentBox);
              var code2Box = $('#epp-codec-nd', contentBox);
              var code3Box = $('#epp-codec-rd', contentBox);
              var code4Box = $('#epp-codec-th', contentBox);
              code1Box.html('').selectpicker('refresh');
              code2Box.html('').selectpicker('refresh');
              code3Box.html('').selectpicker('refresh');
              code4Box.html('').selectpicker('refresh');
              codes.Codecspriority.map(function(code, key) {
                var codeOption = '';
                code.option.map(function(data, key) {
                  codeOption += '<option value="'+ data['$'].value +'">'+ data['_'] +'</option>';
                });
                switch (code['$'].priority) {
                  case '1':
                    code1Box.html(codeOption).selectpicker('refresh');
                    break;
                  case '2':
                    code2Box.html(codeOption).selectpicker('refresh');
                    break;
                  case '3':
                    code3Box.html(codeOption).selectpicker('refresh');
                    break;
                  case '4':
                    code4Box.html(codeOption).selectpicker('refresh');
                    break;
                }

              });
            }


          }
        });

        $('[data-role=modelSpan]').on('click', function() {
          var model_id = $(this).attr('data-target');
          if (model_id) model_id = model_id.substr(1, model_id.length);
          $('#'+model_id).attr('data-model', $(this).parent().find('input:first').attr('id'));
        });

        _this.initialize(contentBox, option);
        //
        //var form = $('#form-extension-add', contentBox);
        //
        ///**
        // * 绑定Change事件，获取数据时只获取data-mark等于update的元素数据
        // */
        //$('[data-mark]', form).on('change', function () {
        //  $(this).attr('data-mark', 'update');
        //});
        //
        //
        ////-----
        ///**
        // * 区分update和add的初始化内容，减少不必要的dom操作
        // */
        //
        //if (type == 'update') {
        //
        //  /**
        //   * select选择项初始化
        //   */
        //  var selects = $('[data-selected]', form);
        //  if (selects && selects.size() > 0) {
        //    for (var i = 0; i < selects.size(); i++) {
        //      var select = $(selects[i]);
        //      var options = $('option', select);
        //      if (options && options.size() > 0) {
        //        for (var j = 0; j < options.size(); j++) {
        //          var option = $(options[j]);
        //          if (option.val() == select.attr('data-selected')) {
        //            option.attr('selected', 'selected');
        //          }
        //        }
        //      }
        //    }
        //  }
        //  /**
        //   * checkbox 初始化
        //   */
        //  var checkboxs = $('[data-checked]', form);
        //  if (checkboxs && checkboxs.size() > 0) {
        //    for (var i = 0; i < checkboxs.size(); i++) {
        //      var checkbox = $(checkboxs[i]);
        //      var type = checkbox.attr('type');
        //      if (type == 'checkbox') {
        //        if (checkbox.attr('data-checked')) {
        //          checkbox.attr('checked', 'checked');
        //          //是否添加触发事件判断
        //        }
        //      } else if (type == 'radio') {
        //        if (checkbox.attr('data-checked')) {
        //
        //          var name = checkbox.attr('name');
        //          //console.log(name);
        //          var checked = checkbox.attr('data-checked');
        //          var checked_child = checkbox.attr('data-checked-child');
        //
        //          if (name) {
        //            var radios = $('[name=' + name + ']', form);
        //
        //            if (radios && radios.size() > 0) {
        //              for (var j = 0; j < radios.size(); j++) {
        //                var cbox = $(radios[j]);
        //
        //                var value = cbox.attr('value');
        //                var associated = cbox.attr('data-associated');
        //                var group = cbox.attr('data-group');
        //
        //                if (value == checked && !associated && !group) {
        //                  cbox.attr('checked', 'checked');
        //                  /**
        //                   * 触发当前元素上绑定的click事件
        //                   * 主要是解决一些元素上绑定了一些点击事件，但当页面加载为它赋值的时候
        //                   * 往往不会触发后续
        //                   * _data非正式方法
        //                   */
        //                  try {
        //                    if ($._data(cbox[0], 'events')['click']) {
        //                      cbox.trigger('click');
        //                    }
        //                  } catch (err) {
        //                    cbox.trigger('click');
        //                  }
        //
        //
        //                }
        //                if (value == checked && associated == 'default' && group) {
        //                  cbox.attr('checked', 'checked');
        //
        //                  var associated_box = $('#' + group);
        //
        //                  if (associated_box) {
        //                    var type = associated_box.attr('type');
        //                    if (!type) {
        //                      type = associated_box.attr('data-role');
        //                    }
        //                    if (type == 'select') {
        //                      var options = $('option', associated_box);
        //                      if (options && options.size() > 0) {
        //                        for (var k = 0; k < options.size(); k++) {
        //                          var option = $(options[k]);
        //                          if (option.val() == checked_child) {
        //                            option.attr('selected', 'selected');
        //                          }
        //                        }
        //                      }
        //                    } else if (type == 'text') {
        //                      associated_box.val(checked_child);
        //                    }
        //                    //...
        //                  }
        //
        //
        //                }
        //
        //              }
        //            }
        //          }
        //
        //
        //        }
        //
        //      }
        //
        //    }
        //  }
        //
        /**
         * select 多选初始化
         */
        var select_multi = $('[data-selects]', contentBox);

        if (select_multi && select_multi.size() > 0) {

          for (var i = 0; i < select_multi.size(); i++) {
            var select_box = $(select_multi[i]);
            var value = select_box.attr('data-selects');
            //$('#eo-extension-groups').selectpicker('val',['DEFAULT','SYSTEM'])
            //select_box.selectpicker('val',['DEFAULT','SYSTEM']);
            select_box.selectpicker({style: 'btn dropdown-toggle btn-select'});
            if (value) {
              select_box.selectpicker('val', select_box.attr('data-selects').split(','))
            }
          }
        }
        //
        //}


      }

      var functions = {
        create: function (data) {
          var url = '/callManager/extension/create';
          if (data) {
            url = _this.util.parseURLGet(url, [{key: 'model', value: data.model}, {key: 'mac', value: data.mac}]);
          }
          _this.get(url, function (contentBox) {

            /**
             * 调用初始化方法
             */
            init(contentBox, ['add', 'init', 'load', 'password']);
            $('#ex-vm-loading', contentBox).addClass('hide');
            $('#evm-greeting-file-box', contentBox).addClass('hide');

            $('#extension-apply', contentBox).off('click').on('click', function () {

              var loading = $('#'+$(this).attr('id')+'-loading');


              /**
               * General
               */

              //var number = $('#form-extension-number', form).val();
              //var password = $('#form-extension-password', form).val();

              //_this.ready(["form-extension-number","form-extension-password"]);
              var reqJSON = _this.ready(paras, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);

              console.log(reqJSON);
              //return;

              //var reqJSON = {
              //
              //    "extension_number": number,
              //    "password": password,
              //
              //};

              loading.show();
              _this.AJAXPost('/callManager/extension/create', reqJSON)
                .success(function (data) {
                  loading.hide();
                  if (!data) {
                    data = 'Creating a successful '
                  } else {
                    data = _this.util.parseJSON(data);
                  }
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');

                    $('#e-cancel', contentBox).trigger('click');
                  }
                });

            });

          });
        },
      };

      if (back) {
        back(functions);
        return;
      }

      _this.get(url, function (contentBox) {
        
        //绑定add Extensions 事件
        $('#btn-add-extension', contentBox).on('click', functions.create);

        // 绑定update事件
        $('[name=e-update-btn]', contentBox).off('click').on('click', function () {
          var number = $(this).attr('data-en');
          var url = '/callManager/extension/update';
          url = _this.util.parseURLGet(url, [{key: 'extension_number', value: number}]);
          _this.get(url, function (contentBox) {

            /**
             * 调用初始化方法
             */
            init(contentBox, ['select', 'checkbox', 'update', 'child', 'file', 'load', 'password']);

            $('#extension-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(paras, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              //return;
              loading.show();
              _this.AJAXPost('/callManager/extension/update', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  _this.show('success', 'Operation is successful');
                  if (data && data.vm === 'success') {

                    if (data && data.vm) {
                      // var fileInput = $('#gfs-input-file', contentBox);
                      // var fileData = fileInput && fileInput[0]?fileInput[0].files[0] : {};
                      // if (fileData && fileData.name) {
                      //   _this.UploadFile('/callManager/extension/greeting/upload', fileData)
                      //     .success(function (data) {
                      //       var result = {};
                      //       result.extension_number = reqJSON.extension_number;
                      //       result.filename = data.fileName;
                      //       result.display_name = data.realFileName;
                      //
                      //       _this.AJAXPost('/callManager/voiceMain/create', result)
                      //         .success(function (data) {
                      //           console.log('vm craete is ok');
                      //         });
                      //     });
                      // }
                    }
                  }
                  $('#e-cancel', contentBox).trigger('click');

                });
            });
            //异步获取VoiceMail数据
            $('#ex-tab-voice-mail', contentBox).off('click').one('click', function() {

              (function initVM(types) {
                var ep = _this.Eventproxy();
                ep.all('vmData', 'gfsData', function (vmData, gfsData) {

                  vmData = _this.util.parseJSON(vmData);

                  var vmStr = vmData.vmHTML;
                  var vmFileStr = vmData.vmFileHTML;
                  delete vmData.vmHTML;
                  delete vmData.vmFileHTML;

                  var result = {};
                  result.data = {};
                  result.data.eData = {};
                  result.data.eData.voice_mail = vmData.vmData;
                  result.data.gfsData = _this.util.parseJSON(gfsData);
                  result.trimValue = _this.util.trimValue;

                  if(types && types.indexOf('vm') >= 0) {
                    var vmHTML = ejs.render(vmStr, result);
                    $('#exampleTabsTwo', contentBox).replaceWith(vmHTML);
                    _this.initialize(contentBox, ['checkbox']);
                    //主动初始化select事件
                    $('[data-role=select]', contentBox).selectpicker({style: 'btn dropdown-toggle btn-select'});
                  }

                  if(types && types.indexOf('file') >= 0) {
                    var vmFileHTML = ejs.render(vmFileStr, result);
                    $('#evm-greeting-file-box', contentBox).html(vmFileHTML);
                    _this.initialize(contentBox, ['file']);

                    $('[name=gfs-btn-set]', contentBox).off('click').on('click', function() {
                      _this.AJAXPost('/callManager/extension/greeting/update',
                        {filename: $(this).attr('data-value'), extension_number: number})
                        .success(function(data) {
                          console.log(data);
                          if(data && data.result === 'success') {
                            initVM(['file']);
                          }
                        });
                    });
                    $('[name=gfs-btn-delete]', contentBox).off('click').on('click', function() {
                      _this.AJAXPost('/callManager/extension/greeting/delete',
                        {filename: $(this).attr('data-value'), extension_number: number})
                        .success(function(data) {
                          console.log(data);
                          if(data && data.result === 'success') {
                            initVM(['file']);
                          }
                        });
                    });
                    $('#gfs-input-file', contentBox).on('change', function() {
                      var fileData = $('#gfs-input-file', contentBox)[0].files[0];
                      if (fileData && fileData.name) {
                        _this.UploadFile('/callManager/extension/greeting/upload', fileData)
                          .success(function (data) {
                            var result = {};
                            result.extension_number = number;
                            result.filename = data.fileName;
                            result.display_name = data.realFileName;

                            _this.AJAXPost('/callManager/voiceMain/create', result)
                              .success(function (data) {
                                initVM(['file']);
                              });
                          });
                      }
                    });
                  }

                  $('#exampleTabsTwo', contentBox).addClass('active');


                  ////vm table 事件
                  //$('table tbody tr', contentBox).click(function(){
                  //  $('table tbody tr', contentBox).removeClass('active');
                  //  $(this).addClass('active');
                  //});

                  $('#ex-vm-loading').addClass('hide');
                });

                _this.AJAXGet(
                  _this.util.parseURLGet('/callManager/voiceMain/show',[{key: 'extension_number', value: number}])
                )
                  .success(function (data) {
                    if (data) {
                      ep.emit('vmData', data);
                    }
                  })
                  .error(function (err) {
                    console.log(err);
                  });
                _this.AJAXGet(
                  _this.util.parseURLGet('/callManager/voiceMain/greetingFileList',[{key: 'extension_number', value: number}])
                )
                  .success(function (data) {
                    if (data) {
                      ep.emit('gfsData', data);
                    }
                  })
                  .error(function (err) {
                    console.log(err);
                  });
              })(['vm', 'file']);




            });

          });



        });

        //绑定delete事件
        $('[name=e-delete-btn]', contentBox).off('click').on('click', function () {
          var number = $(this).attr('data-en');


          var reqJSON = {extension_number: number}
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/extension/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log('extension delete');
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['ex'](_this);
              }
            });
        });

        //分页
        $('[data-role=page]', contentBox).off('click').on('click', function() {
          //var realUrl = url.substr(0, url.indexOf('?'));
          _this.menuDescribe['ex'](_this, $(this).attr('data-page'));
          return false;
        });

        //导入
        $('#ex-btn-import input', contentBox).on('change', function() {
          console.log($(this).val());
          var fileData = $(this)[0].files[0];
          if (fileData && fileData.name) {
            _this.UploadFile('/callManager/extension/import',  fileData)
              .success(function(data) {
                if(data.err_code) {
                  _this.show('warning', data.msg || 'extension import is error');
                }else {
                  _this.show('success', 'Import success');
                  _this.menuDescribe['ex'](_this);
                }
              });
          }
        });
        
        //导出
        $('#ex-btn-export', contentBox).off('click').on('click', function() {


          var path = _this.util.parseURLGet('/callManager/extension/export');
          
          window.open(path,'_blank');

          // window.local.href = '';

          // _this.AJAXPost('/callManager/extension/export', {})
          //   .success(function(data) {
          //
          //     console.log(data);
          //
          //   });
          
        });

      });

    },
    gm: function (_this) {
      var token = $.cookie('token');
      var url = '/callManager/extension/group?access_token=' + token + '&cursor=1';
      _this.get(url, function (contentBox) {

        var paras = {
          name: 'default',
          ids: [
            {id: 'egm-group-id', describe: 'group_id'},
            {id: 'egm-group-name', describe: 'group_name'},
            {id: 'egm-group-description', describe: 'group_description'},
            {id: 'egm-allow-intercom', describe: 'enable_intercom'},
            {id: 'egm-external-call', describe: 'enable_external_call'},
            {id: 'egm-console-access', describe: 'enable_management_console_access'},
            {id: 'egm-extensions-active', describe: 'members'}
          ]
        };

        function init(contentBox, option) {

          _this.initialize(contentBox, option);

          ///**
          // * checkbox 初始化
          // */
          //var checkboxs = $('[data-checked]', contentBox);
          //if (checkboxs && checkboxs.size() > 0) {
          //  for (var i = 0; i < checkboxs.size(); i++) {
          //    var checkbox = $(checkboxs[i]);
          //    var type = checkbox.attr('type');
          //    if (type == 'checkbox') {
          //      if (checkbox.attr('data-checked')) {
          //        checkbox.attr('checked', 'checked');
          //        //是否添加触发事件判断
          //      }
          //    }
          //    //次页面不考虑radio的情况checkbox是否添加在统一初始化还需考虑
          //  }
          //}

        }

        /**
         * 新增
         */
        $('#btn-add-group', contentBox).on('click', function () {
          _this.get('/callManager/extension/group/create', function (contentBox) {

            init(contentBox, ['listbox', 'init', 'load']);

            $('#egm-add', contentBox).on('click', function () {

              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(paras, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              loading.show();
              _this.AJAXPost('/callManager/extension/group/create', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');
                    $('#egm-cancel', contentBox).trigger('click');
                  }
                });

            });


          });
        });
        /**
         * 修改
         */
        var btns = $('[name=egm-update-btn]', contentBox);
        if (btns && btns.size() > 0) {
          for (var i = 0; i < btns.size(); i++) {
            $(btns[i]).on('click', function () {
              var group_id = $(this).attr('data-egm-id');
              var url = '/callManager/extension/group/update';
              url = _this.util.parseURLGet(url, [{key: 'group_id', value: group_id}]);

              _this.get(url, function (contentBox) {

                init(contentBox, ['listbox', 'update', 'checkbox', 'load']);

                $('#egm-add').off('click').on('click', function () {
                  var loading = $('#'+$(this).attr('id')+'-loading');
                  var reqJSON = _this.ready(paras, contentBox);
                  reqJSON = _this.util.parseURLPost(reqJSON);
                  console.log(reqJSON);
                  loading.show();
                  _this.AJAXPost('/callManager/extension/group/update', reqJSON)
                    .success(function (data) {
                      loading.hide();
                      data = _this.util.parseJSON(data);

                      if (data && data.err_code) {
                        _this.show('warning', data.msg);
                      } else {
                        _this.show('success', 'Create is ok');
                        $('#egm-cancel', contentBox).trigger('click');
                      }
                    });

                });
              });


            });

          }
        }
        //绑定delete
        $('[name=egm-delete-btn]', contentBox).off('click').on('click', function () {
          var groupId = $(this).attr('data-egm-id');

          var reqJSON = {group_id: groupId};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/extension/group/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['gm'](_this);
              }
            });

          //$.post('/callManager/extension/group/delete', reqJSON).success(function (data) {
          //  data = _this.util.parseJSON(data);
          //  if (data && data.err_code) {
          //    _this.show('warning', data.msg);
          //  } else {
          //    _this.show('success', 'Delete is ok');
          //
          //    _this.menuDescribe['gm'](_this);
          //  }
          //}).error(function (e) {
          //  console.log('error');
          //  console.log(e);
          //  _this.show('error', 'Create a failure');
          //});


        });


      });
    },
    sex: function (_this, page) {
      page = page || 1;
      var url = '/callManager/systemExtensions';
      url = _this.util.parseURLGet(url, [{key: 'page', value: page}]);
      _this.get(url, function (contentBox) {
        //...

        //绑定刷新功能
        $('#sex-refresh', contentBox).off('click').on('click', function () {
          _this.menuDescribe['sex'](_this);
        });

        //分页
        $('[data-role=page]', contentBox).off('click').on('click', function() {
          console.log('666');
          //var realUrl = url.substr(0, url.indexOf('?'));
          _this.menuDescribe['sex'](_this, $(this).attr('data-page'));
          return false;
        });
      });

    },
    dat: function (_this) {

      _this.get('/callManager/domain', function (contentBox) {

        _this.initialize(contentBox);
        
        $('#dat-domain-btn', contentBox).off('click').on('click', function () {
          $(this).addClass('hide');
          $('#dat-domain', contentBox).removeAttr('disabled').select();
          $('#dat-domain-btn-cancel', contentBox).removeClass('hide');
          $('#dat-domain-btn-apply', contentBox).removeClass('hide');
        });

        $('#dat-domain-btn-cancel', contentBox).off('click').on('click', function () {
          $('#dat-domain-btn-cancel', contentBox).addClass('hide');
          $('#dat-domain-btn-apply', contentBox).addClass('hide');
          $('#dat-domain-btn', contentBox).removeClass('hide');
          $('#dat-domain', contentBox).attr('disabled', 'disabled').val($(this).attr('data-value'));
        });

        /**
         * Update doMain
         */
        $('#dat-domain-btn-apply', contentBox).on('click', function () {
          var pargs = {
            name: 'default',
            ids: [
              {id: 'dat-domain', describe: 'domain'}
            ]
          };
          var url = '/callManager/domain/update';
          var reqJSON = _this.ready(pargs, contentBox);
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost(url, reqJSON).success(function (data) {
            //console.log(data);
            if (!data) {
              data = 'Creating a successful'
            } else {
              data = _this.util.parseJSON(data);
            }
            if (data && data.err_code) {
              _this.show('warning', data.msg);
            } else {
              _this.show('success', 'Create is ok');


              $('#dat-domain-btn-cancel', contentBox).attr('data-value', $('#dat-domain').val()).trigger('click');

            }

          });
        });

        /**
         * Add Transports
         */
        $('#testLogBut', contentBox).on('click', function () {
          _this.get('/callManager/domain/transports/update', function (contentBox) {
            $('#bat-transport-loading', contentBox).hide();
            _this.initialize(contentBox, ['file', 'update', 'init', 'load', 'password']);

            var pargs = {
              name: 'default',
              ids: [
                {id: 'dat-protocol', describe: 'protocol'},
                {id: 'dat-port', describe: 'port', type: 'Number'},
                {id: 'dat-certificate-file', describe: 'certificate_file'},
                {id: 'dat-private-key-file', describe: 'private_key_file'},
                {id: 'dat-root-certificate-file', describe: 'root_certificate_file'},
                {id: 'dat-private-key', describe: 'password_for_private_key_file'},
                {id: 'dat-client-verification', describe: 'certificate_verification_method'}
              ]
            };

            $('#dat-transports-apply', contentBox).on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var url = '/callManager/domain/transports/update';
              var reqJSON = _this.ready(pargs, contentBox);
              /*
               *  逻辑修改,先上传文件,在提交transports
               */
              if (reqJSON && (reqJSON.protocol === 'TLS' || reqJSON.protocol === 'WSS') ) {
                $('#bat-transport-loading', contentBox).show();
                var ep = _this.Eventproxy();
                var certificateFile = $('#dat-certificate', contentBox)[0].files[0];
                var rootFile = $('#dat-root-certificate', contentBox)[0].files[0];
                var privateData = $('#dat-private-file', contentBox)[0].files[0];

                if(certificateFile && certificateFile.name &&
                  rootFile && rootFile.name &&
                  privateData && privateData.name) {
                  ep.all('certificateFile', 'rootFile', 'privateData', function(certificateFile, rootFile, privateData) {
                    $('#bat-transport-loading', contentBox).hide();
                    addTransports();
                  });
                  ep.fail(function(err) {
                    _this.show('warning', 'upload ERROR');
                    $('#bat-transport-loading', contentBox).hide();
                  });
                  _this.UploadFile('/callManager/domain/transports/upload', certificateFile)
                    .success(function (data) {
                      console.log('upload certificate file is ok');
                      ep.emit('certificateFile', {});
                    });
                  _this.UploadFile('/callManager/domain/transports/upload?name=root', rootFile)
                    .success(function (data) {
                      console.log('upload root file is ok');
                      ep.emit('rootFile', {});
                    });
                  _this.UploadFile('/callManager/domain/transports/upload', privateData)
                    .success(function (data) {
                      console.log('upload private file is ok');
                      ep.emit('privateData', {});
                    });
                }else {
                  $('#bat-transport-loading', contentBox).hide();
                  _this.show('warning', 'The certificate file error');
                }
              }else {
                addTransports();
              }

              function addTransports () {
                reqJSON = _this.util.parseURLPost(reqJSON);
                loading.show();
                _this.AJAXPost(url, reqJSON).success(function (data) {
                  loading.hide();
                  //console.log(data);
                  if (!data) {
                    data = 'Creating a successful '
                  } else {
                    data = _this.util.parseJSON(data);
                  }
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');
                    $($('[data-return=dat]')[0]).trigger('click');

                  }
                });
              }

            });

            $('#dat-protocol', contentBox).on('change', function() {
              var value = $(this).val();
              // TLS和WSS的PROTOCOL
              if (value === 'TLS' || value === 'WSS') {
                $('.input-group-file input', contentBox).attr('disabled', false);
                $('#dat-private-key', contentBox).attr('disabled', false);
                $('#dat-client-verification', contentBox)
                  .attr('disabled', false).attr('data-mark', 'update')
                  .selectpicker('refresh');
              }else {
                $('.input-group-file input', contentBox).attr('disabled', true);
                $('#dat-private-key', contentBox).attr('disabled', true);
                $('#dat-client-verification', contentBox)
                  .attr('disabled', true)
                  .attr('disabled', false).attr('data-mark', 'default')
                  .selectpicker('refresh');
              }

              if (value === 'UDP') {
                $('#dat-port', contentBox).val('5060');
              }
              if (value === 'TCP') {
                $('#dat-port', contentBox).val('5063');
              }
              if (value === 'TLS') {
                $('#dat-port', contentBox).val('5061');
              }
              if (value === 'WS') {
                $('#dat-port', contentBox).val('5062');
              }
              if (value === 'WSS') {
                $('#dat-port', contentBox).val('5065');
              }

            }).trigger('change');

          });
        });

        /**
         * Transports
         */
        $('[name=t-btn-delete]', contentBox).off('click').on('click', function () {
          var bnt = $(this);
          var protocol = bnt.attr('data-protocol');
          var port = bnt.attr('data-port');
          if (!isNaN(port)) {
            port = parseInt(port);
          }
          var reqJSON = {protocol: protocol, port: port};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/domain/transports/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['dat'](_this);
              }
            });


        });

      });

    },
    vpt: function (_this) {

      _this.get('/callManager/voIp', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'vpt-name', describe: 'name'},
            {id: 'dat-country', describe: 'country'},
            {id: 'dat-provider', describe: 'provider_brand'},

            {id: 'vpt-website', describe: 'website'},
            {id: 'vpt-hostname', describe: 'hostname'},
            {id: 'vpt-port', describe: 'port', type: 'Number'},
            {id: 'vpt-outbound-server', describe: 'outbound_server'},
            {id: 'vpt-outbound-server-port', describe: 'outbound_server_port', type: 'Number'},
            {id: 'vpt-reregister-interval', describe: 'reregister_interval', type: 'Number'},

            {id: 'vpt-max-concurrent', describe: 'max_concurrent_calls', type: 'Number'},
            {id: 'vpt-auth-id', describe: 'auth_id'},
            {id: 'vpt-password', describe: 'password'},
            {id: 'vpt-require-register', describe: 'require_register'}
          ]
        };


        //依赖形Select初始化 包含update时有默认值情况
        //很扯淡的一段儿逻辑，希望以后有人看得懂吧
        function initSelect(contentBox, type) {
          var selectBox = $('#dat-country', contentBox);

          selectBox.on('change', function () {
            $('#country-provider').html('');
            $('#country-provider').html($('[data-provider=provers-' + $(this).val() + ']').clone());
            setValue(null);
            var cur_select = $('#country-provider select');
            cur_select.selectpicker({style: 'btn dropdown-toggle btn-select'});
            cur_select.on('change', providerChange).trigger('change');

          });

          if (selectBox.attr('data-selected')) {
            $('option[value=' + selectBox.attr('data-selected') + ']', selectBox)
              .attr('selected', true);
            //初始化子SELECT默选项
            var selectChildBox = $('[data-provider=provers-' + selectBox.attr('data-selected') + ']');
            $('option[value=' + selectBox.attr('data-selected-child') + ']', selectChildBox)
              .attr('selected', true);
            $('#country-provider').html('');
            $('#country-provider').html(selectChildBox.clone());
            $('#country-provider select').off('change').on('change', providerChange);
          }


          function setValue(data) {
            if (data) {
              $('#dat-provider', contentBox).val(data.attr('dat-provider-trim')).attr('data-mark', 'update');
              $('#vpt-website', contentBox).val(data.attr('data-website')).attr('data-mark', 'update');
              $('#vpt-hostname', contentBox).val(data.attr('data-hostname')).attr('data-mark', 'update');
              $('#vpt-port', contentBox).val(data.attr('data-port')).attr('data-mark', 'update');
              $('#vpt-outbound-server', contentBox).val(data.attr('data-outbound-server')).attr('data-mark', 'update');
              $('#vpt-outbound-server-port', contentBox).val(data.attr('data-outbound-server-port')).attr('data-mark', 'update');
              $('#vpt-reregister-interval', contentBox).val(data.attr('data-reregister-interval')).attr('data-mark', 'update');
            } else {
              $('#dat-provider', contentBox).val('').attr('data-mark', 'default');
              $('#vpt-website', contentBox).val('').attr('data-mark', 'default');
              $('#vpt-hostname', contentBox).val('').attr('data-mark', 'default');
              $('#vpt-port', contentBox).val('').attr('data-mark', 'default');
              $('#vpt-outbound-server', contentBox).val('').attr('data-mark', 'default');
              $('#vpt-outbound-server-port', contentBox).val('').attr('data-mark', 'default');
              $('#vpt-reregister-interval', contentBox).val('').attr('data-mark', 'default');
            }

          }

          function providerChange() {
            var select_value = $(this).val();
            if (select_value != '0') {
              $(this).attr('data-mark', 'update');
              var select_option = $('option[value=' + select_value + ']', $(this));
              $('#dat-provider', contentBox).val(select_option.attr('dat-provider-trim')).attr('data-mark', 'update');
              /**
               * "website": "http://www.netplanet.at",
               "hostname": "ms1.call.carrier66.net",
               "port": 5060,
               "outbound_server": "ms1.call.carrier66.net",
               "outbound_server_port": 5060,
               "reregister_interval": 60
               */

              setValue(select_option);
            } else {
              $(this).attr('data-mark', 'default');
              setValue(null);
            }
          }

          if( type === 'add') {
            selectBox.trigger('change');
          }

        }


        //绑定Add事件
        $('#add-provider', contentBox).off('click').on('click', function () {
          _this.get('/callManager/voIp/provider', function (contentBox) {

            _this.initialize(contentBox, ['checkbox', 'load', 'password', 'init']);

            initSelect(contentBox, 'add');

            //提交
            $('#dat-providers-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);

              //console.log(reqJSON);
              loading.show();
              _this.AJAXPost('/callManager/voIp/provider', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'Create is ok');

                  $('button[data-return=vpt]', contentBox).trigger('click');
                }
              });
            });


          });

        });

        //绑定update事件
        var btns = $('[name=vpt-update-btn]');
        if (btns && btns.size() > 0) {
          btns.map(function (key, btn) {
            $(btn).on('click', function () {

              var name = $(this).attr('data-value');


              var url = '/callManager/voIp/provider/update';
              url = _this.util.parseURLGet(url, [{key: 'name', value: name}]);

              _this.get(url, function (contentBox) {

                _this.initialize(contentBox, ['update', 'checkbox', 'load', 'password']);

                initSelect(contentBox);

                $('#dat-providers-apply', contentBox).off('click').on('click', function () {

                  var loading = $('#'+$(this).attr('id')+'-loading');
                  var reqJSON = _this.ready(pargs, contentBox);
                  reqJSON = _this.util.parseURLPost(reqJSON);

                  loading.show();
                  _this.AJAXPost('/callManager/voIp/provider/update', reqJSON).success(function (data) {
                    loading.hide();
                    data = _this.util.parseJSON(data);
                    if (data && data.err_code) {
                      _this.show('warning', data.msg);
                    } else {
                      _this.show('success', 'Create is ok');

                      $('button[data-return]', contentBox).trigger('click');
                    }
                  });

                });
              });

            });
          });
        }

        //绑定删除
        $('[name=vpt-delete-btn]').off('click').on('click', function () {

          var btn = $(this);
          var name = btn.attr('data-value');

          var reqJSON = {name: name}
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/voIp/provider/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['vpt'](_this);
              }
            });

        });


      });

    },
    ir: function (_this) {
      _this.get('/callManager/inbound', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'ir-rule-name', describe: 'name'},
            {id: 'ir-rule-type', describe: 'type', type: 'Number'},
            {id: 'ir-number-mask', describe: 'number_mask'},
            {name: 'ir-providers', describe: 'providers', default: 'array'},
            {
              name: 'ir-office',
              type: "group",
              describe: ["office_hours_action", "office_hours_action_value"]
            },
            {
              name: 'ir-outside',
              type: "group",
              describe: ["outside_office_hours_action", "outside_office_hours_action_value"]
            },
          ]
        };

        //绑定添加
        $('#add-inbound-rule', contentBox).off('click').on('click', function () {
          _this.get('/callManager/inbound/create', function (contentBox) {


            _this.initialize(contentBox, ['init', 'model', 'load', 'click'], {extension: _this.backs.extension});

              //提交
            $('#ir-add-apply', contentBox).off('click').on('click', function () {

              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);

              ///api/inbound_rules/create

              loading.show();
              _this.AJAXPost('/callManager/inbound/create', reqJSON)
                .success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg || 'Inbound Create ERROR');
                } else {
                  _this.show('success', 'Create is ok');

                  $('#ir-cancel', contentBox).trigger('click');
                }
              });


            });


          });
        });

        /**
         * 绑定修改
         */
          //var btns =
        $('[name=ir-btn-update]', contentBox).off('click').on('click', function () {
          var name = $(this).attr('data-rn');
          var url = '/callManager/inbound/update';
          url = _this.util.parseURLGet(url, [{key: 'name', value: name}]);
          _this.get(url, function (contentBox) {

            _this.initialize(contentBox, ['select', 'checkboxs', 'checkbox', 'model', 'update', 'child', 'load'],
              {extension: _this.backs.extension});
            //,,,

            $('#ir-add-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              ///api/inbound_rules/create
              loading.show();
              _this.AJAXPost('/callManager/inbound/update', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'Create is ok');

                  $('#ir-cancel', contentBox).trigger('click');
                }
              });

            });


          });
        });

        /**
         * 绑定删除
         */
        $('[name=ir-btn-delete]', contentBox).off('click').on('click', function () {

          var btn = $(this);
          var name = btn.attr('data-value');

          var reqJSON = {name: name};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/inbound/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['ir'](_this);
              }
            });
        });

      });
    },
    or: function (_this) {
      _this.get('/callManager/outbound', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'or-name', describe: 'name'},
            {id: 'or-number-prefix', describe: 'number_prefix'},
            {id: 'or-from-extension', describe: 'from_extension'},
            {id: 'or-number-length', describe: 'number_length', type: 'Number'},
            {id: 'or-from-extension-groups', describe: 'from_extension_groups', type: 'Array'},
            {id: 'or-route-provider-1', describe: 'route_provider_1'},
            {id: 'or-strip-digits-1', describe: 'strip_digits_1', type: 'Number'},
            {id: 'or-prepend-1', describe: 'prepend_1'},
            {id: 'or-route-provider-2', describe: 'route_provider_2'},
            {id: 'or-strip-digits-2', describe: 'strip_digits_2', type: 'Number'},
            {id: 'or-prepend-2', describe: 'prepend_2'},
            {id: 'or-route-provider-3', describe: 'route_provider_3'},
            {id: 'or-strip-digits-3', describe: 'strip_digits_3', type: 'Number'},
            {id: 'or-prepend-3', describe: 'prepend_3'},
          ],
        };

        //新增事件
        $('#add-outbound-rule', contentBox).on('click', function () {
          _this.get('/callManager/outbound/rule', function (contentBox) {
            _this.initialize(contentBox, ['model', 'init', 'load']);

            $('#or-apply').off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/outbound/rule', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'Create is ok');

                  $('button[data-return]', contentBox).trigger('click');
                }
              });
            });

            //...
          });
        });

        //修改事件
        $('[name=or-edit]', contentBox).off('click').on('click', function () {

          var name = $(this).attr('data-or');
          var url = '/callManager/outbound/rule/update';
          url = _this.util.parseURLGet(url, [{key: 'name', value: name}]);

          _this.get(url, function (contentBox) {
            _this.initialize(contentBox, ['select', 'model', 'update', 'load']);

            $('#or-apply').off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              //console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/outbound/rule/update', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'Create is ok');

                  $('button[data-return]', contentBox).trigger('click');
                }
              });
            });

            //...
          });

        });

        //删除事件
        $('[name=or-btn-delete]', contentBox).off('click').on('click', function () {

          var btn = $(this);
          var name = btn.attr('data-value');

          var reqJSON = {name: name};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/outbound/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['or'](_this);
              }
            });
        });

      });
    },
    rg: function (_this) {
      _this.get('/callManager/ringGroups', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'rg-number', describe: 'ring_group_number'},
            {id: 'rg-name', describe: 'name'},
            {id: 'rg-ring-time', describe: 'ring_time', type: 'Number'},
            {id: 'rg-ring-strategy', describe: 'ring_strategy', type: 'Number'},
            {id: 'rg-members-active', describe: 'members'},
            {
              name: "rg-radio-answer",
              type: "group",
              describe: ["no_answer_action", "no_answer_action_value"]
            },
          ]
        };

        function init(contentBox, option, backs) {
          option.push('click');
          _this.initialize(contentBox, option, backs);

          //公共方法

          $('#rg-ring-strategy', contentBox).on('change', function() {
            var optionBox = $('#rg-no-answer-option', contentBox);
            if ($(this).val() === '5') {
              $('#rg-ring-time', contentBox).attr('data-mark', 'default').attr('disabled', true).val('');
              optionBox.hide();
              $('input[type=radio]', optionBox).attr('data-mark', 'default');

            }else {
              $('#rg-ring-time', contentBox).attr('data-mark', 'update').attr('disabled', false);
              $('#rg-no-answer-option', contentBox).show();
              $('input[type=radio]', optionBox).attr('data-mark', 'update');
            }
          }).trigger('change');

        }

        //新增
        $('#add-ring-group', contentBox).on('click', function () {
          _this.get('/callManager/ringGroups/ringGroup', function (contentBox) {
            init(contentBox, ['listbox', 'model', 'init', 'load'],
              {extension: _this.backs.extension});


            $('#rg-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              //修改默认值 default: 'array' 只有在create的时候才需要穿空数组
              //pargs.ids[4].default= 'array';

              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              ///api/ring_groups/create
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/ringGroups/ringGroup', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');

                    $('button[data-return]', contentBox).trigger('click');
                  }
                }).error(function (err) {
                  _this.show('error', err);
                });


            });


          });

        });

        //修改
        $('[name=rg-edit]', contentBox).map(function (key, data) {
          $(data).off('click').on('click', function () {

            var number = $(this).attr('data-rg');
            var url = '/callManager/ringGroups/ringGroup/update';
            url = _this.util.parseURLGet(url, [{key: 'ring_group_number', value: number}]);

            _this.get(url, function (contentBox) {

              init(contentBox, ['select', 'checkbox', 'listbox', 'child', 'model', 'update', 'init', 'load'],
                {extension: _this.backs.extension});

              $('#rg-apply', contentBox).off('click').on('click', function () {
                var loading = $('#'+$(this).attr('id')+'-loading');
                console.log(pargs);
                var reqJSON = _this.ready(pargs, contentBox);
                reqJSON = _this.util.parseURLPost(reqJSON);
                console.log(reqJSON);

                loading.show();
                _this.AJAXPost('/callManager/ringGroups/ringGroup/update', reqJSON)
                  .success(function (data) {
                    loading.hide();
                    data = _this.util.parseJSON(data);
                    if (data && data.err_code) {
                      _this.show('warning', data.msg);
                    } else {
                      _this.show('success', 'Create is ok');
                      $('button[data-return]', contentBox).trigger('click');
                    }
                  }).error(function (err) {
                    _this.show('error', 'Delete ERROR');
                  });


              });


            });

          })
        });

        //删除
        $('[name=rg-btn-delete]', contentBox).off('click').on('click', function () {

          var btn = $(this);
          var number = btn.attr('data-value');

          var reqJSON = {ring_group_number: number};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/ringGroups/ringGroup/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['rg'](_this);
              }
            }).error(function (err) {
              console.log('error');
              console.log(err);
              _this.show('error', 'Create a failure');
            });

        });


      }, 'site-menubar-unfold');
    },
    vr: function (_this) {
      //Virtual Receptionist
      _this.get('/callManager/virtualReceptionist', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'vr-number', describe: 'virtual_receptionist_number'},
            {id: 'vr-name', describe: 'name'},
            {id: 'vr-prompt', describe: 'prompt'},

            {id: [{id: 'vr-key0', type: 'Number'}, {id: 'vr-key0-value', default: ' '}], describe: 'key0'},
            {id: [{id: 'vr-key1', type: 'Number'}, {id: 'vr-key1-value', default: ' '}], describe: 'key1'},
            {id: [{id: 'vr-key2', type: 'Number'}, {id: 'vr-key2-value', default: ' '}], describe: 'key2'},
            {id: [{id: 'vr-key3', type: 'Number'}, {id: 'vr-key3-value', default: ' '}], describe: 'key3'},
            {id: [{id: 'vr-key4', type: 'Number'}, {id: 'vr-key4-value', default: ' '}], describe: 'key4'},
            {id: [{id: 'vr-key5', type: 'Number'}, {id: 'vr-key5-value', default: ' '}], describe: 'key5'},
            {id: [{id: 'vr-key6', type: 'Number'}, {id: 'vr-key6-value', default: ' '}], describe: 'key6'},
            {id: [{id: 'vr-key7', type: 'Number'}, {id: 'vr-key7-value', default: ' '}], describe: 'key7'},
            {id: [{id: 'vr-key8', type: 'Number'}, {id: 'vr-key8-value', default: ' '}], describe: 'key8'},
            {id: [{id: 'vr-key9', type: 'Number'}, {id: 'vr-key9-value', default: ' '}], describe: 'key9'},
            {
              id: [{id: 'vr-timeout-number', type: 'Number', default: 30}, {id: 'vr-timeout', type: 'Number'},
                {id: 'vr-timeout-value', default: ' '}], describe: 'timeout'
            },
          ]
        };

        function init(contentBox, options, backs) {
          _this.initialize(contentBox, options, backs);

          /**
           * 修改了model的加载方式，旧的先保留一段事件，如果新的运行稳定可删除备注部分
           */
            //初始化selected改变model
            //$('[data-role=select]', contentBox).off('change').on('change', function () {
            //  console.log('select ahange');
            //  //$('div[name=model-1]', contentBox).addClass('hide');
            //
            //  var cur_select = $(this);
            //  var cur_option = $('option:selected', cur_select);
            //  var value_box_id = cur_select.attr('data-value-id');
            //  var value_box = $('#' + value_box_id);
            //  $('span:first', value_box).attr('data-target', cur_option.attr('data-model-id'));
            //  $('[data-mark=vr-model]', contentBox).attr('data-model', $('input:first', value_box).attr('id'));
            //  cur_select.attr('data-mark', 'update');
            //
            //});

          $('[data-role=modelSpan]', contentBox).map(function (key, data) {
            var span = $(data);
            span.on('click', function () {
              var key = span.attr('data-id');
              var cur_select = $('#' + key, contentBox);
              var cur_option = $('option:selected', cur_select);
              var value_box_id = cur_select.attr('data-value-id');
              var value_box = $('#' + value_box_id);
              span.attr('data-target', cur_option.attr('data-model-id'));
              $('[data-mark=vr-model]', contentBox).attr('data-model', $('input:first', value_box).attr('id'));
              cur_select.attr('data-mark', 'update');
            });
          });


        }

        //新增
        $('#add-virtual-receptionist', contentBox).on('click', function () {
          _this.get('/callManager/virtualReceptionist/create', function (contentBox) {
            //_this.initialize(contentBox, ['file', 'model']);
            init(contentBox, ['file', 'model', 'load']);

            $('#vr-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/virtualReceptionist/create', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');

                    var fileData = $('#vr-prompt-file', contentBox)[0].files[0];

                    if (fileData && fileData.name) {
                      _this.UploadFile('/callManager/virtualReceptionist/upload', fileData)
                        .success(function (uploadData) {
                          var result = data;
                          if(uploadData.result === 'success') {
                            delete uploadData.result;
                            result = $.extend({}, result, uploadData);
                            _this.AJAXPost('/callManager/virtualReceptionist/ivr/create', result)
                              .success(function (data) {
                                console.log('vm craete is ok');
                              });
                          }
                        });
                    }


                    $('button[data-return]', contentBox).trigger('click');
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });

            });
          });
        });

        $('[name=vr-edit]', contentBox).off('click').on('click', function () {
          var name = $(this).attr('data-vr');
          var url = '/callManager/virtualReceptionist/update';
          url = _this.util.parseURLGet(url, [{key: 'virtual_receptionist_number', value: name}]);

          _this.get(url, function (contentBox) {

            init(contentBox, ['file', 'model', 'update', 'select', 'load'],
              {extension: _this.backs.extension});

            $('#vr-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/virtualReceptionist/update', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');

                    var fileData = $('#vr-prompt-file', contentBox)[0].files[0];
                    if (fileData && fileData.name) {
                      _this.UploadFile('/callManager/virtualReceptionist/upload', fileData)
                        .success(function (uploadData) {
                          var result = data;
                          if(uploadData.result === 'success') {
                            delete uploadData.result;
                            result = $.extend({}, result, uploadData);
                            _this.AJAXPost('/callManager/virtualReceptionist/ivr/update', result)
                              .success(function (data) {
                                console.log('vm craete is ok');
                              });
                          }
                        });
                    }else {

                      _this.AJAXPost('/callManager/virtualReceptionist/ivr/update', data)
                        .success(function (data) {
                          console.log('vm craete is ok');
                        });
                    }

                    $('button[data-return]', contentBox).trigger('click');
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });

            });


          });

        });

        $('[name=vr-btn-delete]').off('click').on('click', function () {
          var btn = $(this);
          var number = btn.attr('data-value');

          var reqJSON = {virtual_receptionist_number: number};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/virtualReceptionist/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['vr'](_this);
              }
            }).error(function (err) {
              console.log('error');
              console.log(err);
              _this.show('error', 'Create a failure');
            });

        });

      }, 'site-menubar-unfold');
    },
    cq: function (_this) {
      //Virtual Receptionist
      _this.get('/callManager/callQueue', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'cq-number', describe: 'queue_number'},
            {id: 'cq-queue-name', describe: 'name'},
            {id: 'cq-ring-time', describe: 'ring_time', type: 'Number'},
            {id: 'cq-polling-strategy', describe: 'polling_strategy', type: 'Number'},
            {id: 'cq-music-on-hold', describe: 'music_on_hold'},
            {id: 'cq-members-active', describe: 'members'},
            {
              name: "cq-radio-answer",
              type: "group",
              describe: ["no_answer_action", "no_answer_action_value"]
            },
            {id: 'cq-enable-intro-prompt', describe: 'enable_intro_prompt'},
            {id: 'cq-enable-play-full-intro', describe: 'enable_play_full_intro'},
            {id: 'cq-intro-prompt-file', describe: 'intro_prompt_file'},
            {id: 'cq-max-wait-time', describe: 'max_wait_time', type: 'Number'},
            {id: 'cq-max-callers', describe: 'max_callers', type: 'Number'},
            {id: 'cq-queue-caller', describe: 'enable_announce_caller_position'},
            {id: 'cq-announcement-interval', describe: 'announce_caller_position_interval', type: 'Number'},

          ]
        };

        //绑定新增
        $('#add-queue', contentBox).on('click', function () {
          _this.get('/callManager/callQueue/create', function (contentBox) {
            _this.initialize(contentBox, ['file', 'listbox', 'model', 'init', 'load', 'click']);

            $('#cq-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/callQueue/create', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');

                    //$('#cq-file-music', contentBox)

                    var fileMusic = $('#cq-file-music', contentBox)[0].files[0];
                    var filePrompt = $('#cq-file-prompt', contentBox)[0].files[0];

                    if (fileMusic && fileMusic.name) {
                      _this.UploadFile('/callManager/callQueue/upload', fileMusic)
                        .success(function (uploadMusicData) {
                          var result = $.extend({}, reqJSON, data);
                          if(uploadMusicData.result === 'success') {
                            delete uploadMusicData.result;
                            result = $.extend({}, result,
                              {
                                'music_on_hold': uploadMusicData.name,
                                'music_on_hold_diskname': uploadMusicData.diskname
                              });
                            if (filePrompt && filePrompt.name) {
                              _this.UploadFile('/callManager/callQueue/upload', filePrompt)
                                .success(function (uploadData) {
                                  //var result = data;
                                  if(uploadData.result === 'success') {
                                    delete uploadData.result;
                                    result = $.extend({}, result,
                                      {
                                        'intro_prompt_file': uploadData.name,
                                        'intro_prompt_file_diskname': uploadData.diskname
                                      });
                                    _this.AJAXPost('/callManager/callQueue/cq/create', result)
                                      .success(function (data) {
                                        console.log('vm craete is ok');
                                      });

                                  }

                                });
                            }else {
                              _this.AJAXPost('/callManager/callQueue/cq/create', result)
                                .success(function (data) {
                                  console.log('vm craete is ok');
                                });
                            }

                          }
                        });
                    }

                    $('button[data-return]', contentBox).trigger('click');
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });


            });
            //....
          });

        });

        //绑定修改
        $('[name=cq-edit]', contentBox).off('click').on('click', function () {
          var queue_extension = $(this).attr('data-cq');

          var url = '/callManager/callQueue/update';
          url = _this.util.parseURLGet(url, [{key: 'queue_number', value: queue_extension}]);

          _this.get(url, function (contentBox) {
            _this.initialize(contentBox, ['select', 'checkbox', 'listbox', 'model', 'update', 'file', 'child', 'load']);


            $('#cq-apply', contentBox).off('click').on('click', function () {

              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/callQueue/update', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'update is ok');
                    $('button[data-return]', contentBox).trigger('click');

                    //文件 CQ
                    var fileMusic = $('#cq-file-music', contentBox)[0].files[0];
                    var filePrompt = $('#cq-file-prompt', contentBox)[0].files[0];

                    var result = $.extend({}, reqJSON, data);
                    if (fileMusic && fileMusic.name) {
                      _this.UploadFile('/callManager/callQueue/upload', fileMusic)
                        .success(function (uploadMusicData) {
                          if(uploadMusicData.result === 'success') {
                            delete uploadMusicData.result;
                            result = $.extend({}, result,
                              {
                                'music_on_hold': uploadMusicData.name,
                                'music_on_hold_diskname': uploadMusicData.diskname
                              });
                            if (filePrompt && filePrompt.name) {
                              _this.UploadFile('/callManager/callQueue/upload', filePrompt)
                                .success(function (uploadData) {
                                  //var result = data;
                                  if(uploadData.result === 'success') {
                                    delete uploadData.result;
                                    result = $.extend({}, result,
                                      {
                                        'intro_prompt_file': uploadData.name,
                                        'intro_prompt_file_diskname': uploadData.diskname
                                      });
                                    _this.AJAXPost('/callManager/callQueue/cq/update', result)
                                      .success(function (data) {
                                        console.log('vm craete is ok');
                                      });
                                  }
                                });
                            }else {
                              _this.AJAXPost('/callManager/callQueue/cq/update', result)
                                .success(function (data) {
                                  console.log('vm craete is ok');
                                });
                            }
                          }
                        });
                    }else if (filePrompt && filePrompt.name) {
                      _this.UploadFile('/callManager/callQueue/upload', filePrompt)
                        .success(function (uploadData) {
                          //var result = data;
                          if(uploadData.result === 'success') {
                            delete uploadData.result;
                            result = $.extend({}, result,
                              {
                                'intro_prompt_file': uploadData.name,
                                'intro_prompt_file_diskname': uploadData.diskname
                              });
                            _this.AJAXPost('/callManager/callQueue/cq/update', result)
                              .success(function (data) {
                                console.log('vm craete is ok');
                              });
                          }
                        });
                    }else {
                      _this.AJAXPost('/callManager/callQueue/cq/update', data)
                        .success(function (data) {
                          console.log('vm craete is ok');
                        });
                    }
                  }
                });

            });


          });

        });

        $('[name=cq-btn-delete]', contentBox).off('click').on('click', function () {
          var btn = $(this);
          var number = btn.attr('data-value');

          var reqJSON = {queue_number: number};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/callQueue/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['cq'](_this);
              }
            }).error(function (err) {
              console.log('error');
              console.log(err);
              _this.show('error', 'Create a failure');
            });


        });

      }, 'site-menubar-unfold');
    },
    co: function (_this) {
      _this.get('/callManager/conference/room', function (contentBox) {
        var pargs = {
          name: 'default',
          ids: [
            {id: 'cr-mode', describe: 'mode', type: 'Number'},
            {id: 'cr-room-number', describe: 'room_number'},
            {id: 'cr-room-pin', describe: 'room_pin'},
            {id: 'cr-admin-pin', describe: 'admin_pin'},
            {id: 'cr-max-participants', describe: 'max_participants', type: 'Number'},
          ]
        };

        $('#add-room', contentBox).on('click', function () {
          _this.get('/callManager/conference/room/addRoom', function (contentBox) {

            _this.initialize(contentBox, ['load']);

            $('#cr-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/conference/room/addRoom', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);

                  } else {
                    _this.show('success', 'Create is ok');

                    $('button[data-return]', contentBox).trigger('click');
                    //participants(reqJSON.room_number)
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });


            });

          });

        });

        function ParticipantsManager(number, ip) {
          var url = '/callManager/conference/room/participants';
          url = _this.util.parseURLGet(url, [{key: 'room_number', value: number}, {key: 'ip', value: ip}]);
          _this.get(url, function (contentBox) {

            //绑定model 邀请事件
            $('#modelExtensionsList table tr', contentBox).off('dblclick').on('dblclick', function () {

              var extension_number = $(this).attr('data-value');
              var reqJSON = {room_number: number, op: 2, participant_extension: extension_number, ip: ip};
              reqJSON = _this.util.parseURLPost(reqJSON);

              _this.AJAXPost('/callManager/conference/room/participants/update', reqJSON)
                .success(function (data) {
                  data = _this.util.parseJSON(data);
                  console.log(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Invite the successful');

                    //_this.menuDescribe['rg'](_this);
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });


            });

            //绑定 锁定|静音|记录 事件
            $('[name=co-action]', contentBox).off('click').on('click', function () {
              var type = $(this).attr('data-type');
              var value = $(this).attr('data-value');
              var number = $(this).attr('data-number');

              value = typeof value === 'string'?value==='true':value;

              var reqJSON = {room_number: number, ip: ip};

              if (type == 'lock-room') {
                reqJSON.locked = !value;
              }
              if (type == 'mute-room') {
                reqJSON.muted = !value;
              }
              if (type == 'record-room') {
                reqJSON.recording = !value;
              }

              reqJSON = _this.util.parseURLPost(reqJSON);

              _this.AJAXPost('/callManager/conference/room/updateRoom', reqJSON)
                .success(function (data) {
                  data = _this.util.parseJSON(data);
                  console.log(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Operation is successful');
                    //_this.menuDescribe['co'](_this);
                    ParticipantsManager(number, ip);
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Delete a failure');
                });


            });

            //绑定删除事件
            $('[name=crp-delete]', contentBox).off('click').on('click', function () {
              var extension_number = $(this).attr('data-value');
              var ip = $(this).attr('data-ip');
              var reqJSON = {
                room_number: number,
                op: 3,
                participant_extension: extension_number,
                ip: $(this).attr('data-ip'),
              };
              reqJSON = _this.util.parseURLPost(reqJSON);

              _this.AJAXPost('/callManager/conference/room/participants/update', reqJSON)
                .success(function (data) {
                  data = _this.util.parseJSON(data);
                  console.log(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Invite the successful');
                    ParticipantsManager(number, ip);
                    //_this.menuDescribe['rg'](_this);
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });
            });

            $('[name=crp-audio]', contentBox).off('click').on('click', function () {
              var extension_number = $(this).attr('data-value');
              var ip = $(this).attr('data-ip');
              var reqJSON = {
                room_number: number,
                op: 1,
                participant_extension: extension_number,
                ip: ip,
              };
              reqJSON = _this.util.parseURLPost(reqJSON);

              _this.AJAXPost('/callManager/conference/room/participants/update', reqJSON)
                .success(function (data) {
                  data = _this.util.parseJSON(data);
                  console.log(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Operation is successful');
                    ParticipantsManager(number, ip);
                    //_this.menuDescribe['rg'](_this);
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });
            })

          });
        }

        //绑定双击事件
        $('table tbody tr', contentBox).off('dblclick').on('dblclick', function () {
          var number = $(this).attr('data-value');
          var ip = $(this).attr('data-ip');

          ParticipantsManager(number, ip);
        });

        //修改
        $('[name=co-participants]', contentBox).off('click').on('click', function () {
          var number = $(this).attr('data-value');
          var ip = $(this).attr('data-ip');
          ParticipantsManager(number, ip);
        });

        //删除事件
        $('[name=co-delete]', contentBox).off('click').on('click', function () {

          var number = $(this).attr('data-value');
          var reqJSON = {room_number: number, op: 1};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/callManager/conference/room/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is successful');
                //ParticipantsManager(number);
                _this.menuDescribe['co'](_this);
              }
            }).error(function (err) {
              console.log('error');
              console.log(err);
              _this.show('error', 'Delete a failure');
            });

        });

        //修改时间（非/show获取数据）
        $('[name=co-update]', contentBox).off('click').on('click', function () {
          var number = $(this).attr('data-value');
          var ip = $(this).attr('data-ip');
          var url = '/callManager/conference/room/updateRoom';
          url = _this.util.parseURLGet(url, [{key: 'room_number', value: number}, {key: 'ip', value: ip}]);
          console.log(url);
          _this.get(url, function (contentBox) {

            //$('#cr-mode', contentBox).val(btnData.attr('data-mode'));
            //$('#cr-room-number', contentBox).val(btnData.attr('data-mode'));
            //$('#cr-room-pin', contentBox).val(btnData.attr('data-room-pin'));
            //$('#cr-admin-pin', contentBox).val(btnData.attr('data-admin-pin'));
            //$('#cr-max-participants', contentBox).val(btnData.attr('data-maximum-participants'));

            _this.initialize(contentBox, ['update', 'select', 'load']);

            $('#cr-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/callManager/conference/room/updateRoom', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);

                  } else {
                    _this.show('success', 'Create is ok');

                    $('button[data-return]', contentBox).trigger('click');
                    //participants(reqJSON.room_number)
                  }
                }).error(function (err) {
                  console.log('error');
                  console.log(err);
                  _this.show('error', 'Create a failure');
                });


            });

          });

        });



        //function participants(roomId) {
        //  console.log(666);
        //  var number = roomId;
        //  var url = '/callManager/conference/participants';
        //  url = _this.util.parseURLGet(url, [{key: 'room_number', value: number}]);
        //  _this.get(url, function (contentBox) {
        //
        //  });
        //}


      });
    },
    vm: function (_this) {
      _this.get('/callManager/voiceMain', function (contentBox) {

        _this.initialize(contentBox, ['checkbox', 'load']);


        var pargs = {
          name: 'default',
          ids: [
            {id: 'vm-number', describe: 'voice_mail_number'},
            {id: 'vm-less-seconds', describe: 'voice_mail_not_save_if_less_seconds', type: 'Number'},
            {id: 'vm-cleaning-voicemail', describe: 'auto_cleaning_voicemail_days', type: 'Number'},
          ]
        };

        $('#vm-apply').off('click').on('click', function () {

          var loading = $('#'+$(this).attr('id')+'-loading');
          var reqJSON = _this.ready(pargs, contentBox);
          reqJSON = _this.util.parseURLPost(reqJSON);
          console.log(reqJSON);

          loading.show();
          _this.AJAXPost('/callManager/voiceMain/update', reqJSON)
            .success(function (data) {
              loading.hide();
              data = _this.util.parseJSON(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Create is ok');

                _this.menuDescribe['vm'](_this);
              }
            }).error(function (err) {
              console.log('error');
              console.log(err);
              _this.show('error', 'Create a failure');
            });

        });

      });
    },
    con: function (_this) {
      //加载动画为做

      (function contactsShow(groupId) {

        var url = '/callManager/contacts';
        if (groupId) {
          url = _this.util.parseURLGet(url, [{key: 'group_id', value: groupId}]);
        }
        _this.get(url, function (contentBox) {

          //初始化头部按钮区域的select
          _this.initialize(contentBox, ['select']);

          var pargs = {
            name: 'default',
            ids: [
              {id: 'con-number', describe: 'extension_number'},
              {id: 'con-first-name', describe: 'first_name'},
              {id: 'con-last-name', describe: 'last_name'},
              {id: 'con-gender', describe: 'gender'},
              {id: 'con-email', describe: 'email'},
              {id: 'con-company-name', describe: 'company_name'},
              {id: 'con-company-website', describe: 'company_website'},
              {id: 'con-mobile-phone', describe: 'mobile_phone'},
              {id: 'con-work-phone', describe: 'work_phone'},
              {id: 'con-home-phone', describe: 'home_phone'},
              {id: 'con-twitter', describe: 'twitter'},
              {id: 'con-facebook', describe: 'facebook'},
              {id: 'con-linked-in', describe: 'linkedin'},
              {id: 'con-instagram', describe: 'instagram'},
              {id: 'con-description', describe: 'description'},
            ]
          };

          $('#con-btn-create', contentBox).off('click').on('click', function () {
            _this.get('/callManager/contacts/create', function (contentBox) {
              _this.initialize(contentBox);
              $('#con-btn-apply', contentBox).off('click').on('click', function () {
                var reqJSON = _this.ready(pargs, contentBox);
                reqJSON = _this.util.parseURLPost(reqJSON);
                //console.log(reqJSON);

                _this.AJAXPost('/callManager/contacts/create', reqJSON)
                  .success(function (data) {
                    data = _this.util.parseJSON(data);
                    if (data && data.err_code) {
                      _this.show('warning', data.msg);
                    } else {
                      _this.show('success', 'Create is ok');

                      $('button[data-return]').trigger('click');
                    }
                  });
              });

            });
          });

          $('[name=con-delete]', contentBox).off('click').on('click', function () {
            var contactId = $(this).attr('data-value');

            var reqJSON = {room_number: contactId};
            reqJSON = _this.util.parseURLPost(reqJSON);

            _this.AJAXPost('/callManager/contacts/delete', reqJSON)
              .success(function (data) {
                data = _this.util.parseJSON(data);
                console.log(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'Delete is successful');
                  //ParticipantsManager(number);
                  //_this.menuDescribe['con'](_this);
                  contactsShow($('#con-select-group').val());

                }
              }).error(function (err) {
                console.log('error');
                console.log(err);
                _this.show('error', 'Delete a failure');
              });

          });

          $('[name=con-update]', contentBox).off('click').on('click', function () {

            var number = $(this).attr('data-value');
            var url = '/callManager/contacts/update';
            url = _this.util.parseURLGet(url, [{key: 'contact_id', value: number}]);

            _this.get(url, function (contentBox) {

              _this.initialize(contentBox, ['update']);

              $('#con-btn-apply', contentBox).off('click').on('click', function () {
                var reqJSON = _this.ready(pargs, contentBox);
                reqJSON = _this.util.parseURLPost(reqJSON);
                //console.log(reqJSON);

                _this.AJAXPost('/callManager/contacts/update', reqJSON)
                  .success(function (data) {
                    data = _this.util.parseJSON(data);
                    if (data && data.err_code) {
                      _this.show('warning', data.msg);
                    } else {
                      _this.show('success', 'Create is ok');

                      $('button[data-return]').trigger('click');
                    }
                  });
              });


            });


            //var contactId = $(this).attr('data-value');
            //
            //var reqJSON = { room_number: contactId };
            //reqJSON = _this.util.parseURLPost(reqJSON);
            //
            //_this.AJAXPost('/callManager/contacts/update', reqJSON)
            //  .success(function (data) {
            //    data = _this.util.parseJSON(data);
            //    console.log(data);
            //    if (data && data.err_code) {
            //      _this.show('warning', data.msg);
            //    } else {
            //      _this.show('success', 'Delete is successful');
            //      //ParticipantsManager(number);
            //      _this.menuDescribe['co'](_this);
            //    }
            //  }).error(function (err) {
            //    console.log('error');
            //    console.log(err);
            //    _this.show('error', 'Delete a failure');
            //  });

          });

          $('#con-btn-group', contentBox).off('click').on('click', function () {

            (function contactsGroupShow() {
              _this.get('/callManager/contacts/group', function (contentBox) {


                $('#con-btn-create', contentBox).off('click').on('click', function () {
                  _this.get('/callManager/contacts/group/create', function (contentBox) {

                    _this.initialize(contentBox);
                    $('[name=cong-return]', contentBox).off('click').on('click', function () {
                      contactsGroupShow();
                    });

                    var pargs = {
                      name: 'default',
                      ids: [
                        {id: 'cong-name', describe: 'group_name'},
                        {id: 'cong-members', describe: 'members'},
                      ]
                    };

                    $('#cong-btn-apply').off('click').on('click', function () {

                      var reqJSON = _this.ready(pargs, contentBox);
                      reqJSON = _this.util.parseURLPost(reqJSON);

                      _this.AJAXPost('/callManager/contacts/group/create', reqJSON)
                        .success(function (data) {
                          data = _this.util.parseJSON(data);
                          if (data && data.err_code) {
                            _this.show('warning', data.msg);
                          } else {
                            _this.show('success', 'Create is ok');

                            $('button[name=cong-return]').trigger('click');
                          }
                        });


                    });

                  });
                });

                $('[name=cong-delete]').off('click').on('click', function () {

                  var number = $(this).attr('data-value');
                  var url = '/callManager/contacts/update';
                  url = _this.util.parseURLGet(url, [{key: 'contact_id', value: number}]);

                  _this.AJAXPost('/callManager/contacts/group/delete', reqJSON)
                    .success(function (data) {
                      data = _this.util.parseJSON(data);
                      console.log(data);
                      if (data && data.err_code) {
                        _this.show('warning', data.msg);
                      } else {
                        _this.show('success', 'Delete is successful');
                        contactsGroupShow();

                      }
                    }).error(function (err) {
                      console.log('error');
                      console.log(err);
                      _this.show('error', 'Delete a failure');
                    });

                });

                $('[name=cong-update]').off('click').on('click', function () {

                  /**
                   * 界面调整，待定稿后再继续挖坑
                   */

                  //var contactId = $(this).attr('data-value');
                  //
                  //var reqJSON = { room_number: contactId };
                  //reqJSON = _this.util.parseURLPost(reqJSON);
                  //
                  //_this.get('/callManager/contacts/group/update', function(contentBox) {
                  //
                  //  _this.initialize(contentBox);
                  //  $('[name=cong-return]', contentBox).off('click').on('click', function() {
                  //    contactsGroupShow();
                  //  });
                  //
                  //  var pargs = {
                  //    name: 'default',
                  //    ids: [
                  //      {id: 'cong-name', describe: 'group_name'},
                  //      {id: 'cong-members', describe: 'members'},
                  //    ]
                  //  };
                  //
                  //  $('#cong-btn-apply').off('click').on('click', function() {
                  //
                  //    var reqJSON = _this.ready(pargs, contentBox);
                  //    reqJSON = _this.util.parseURLPost(reqJSON);
                  //
                  //    _this.AJAXPost('/callManager/contacts/group/create', reqJSON)
                  //      .success(function(data) {
                  //        data = _this.util.parseJSON(data);
                  //        if (data && data.err_code) {
                  //          _this.show('warning', data.msg);
                  //        } else {
                  //          _this.show('success', 'Create is ok');
                  //
                  //          $('button[name=cong-return]').trigger('click');
                  //        }
                  //      });
                  //
                  //
                  //  });
                  //
                  //});

                });


              });
            })();


          });

          $('#con-select-group').off('change').on('change', function () {

            var groupId = $(this).val();
            contactsShow(groupId);
          })


        });

      })();
    },
    te: function (_this) {
      _this.get('/tenant', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'te-username', describe: 'username'},
            {id: 'te-password', describe: 'password'},
            {id: 'te-enabled', describe: 'enabled'},
          ],
          children: [
            {
              name: 'office_hours',
              ids: [
                {id: "te-monday-begin", describe: "monday_from"},
                {id: "te-monday-end", describe: "monday_to"},
                {id: "te-tuesday-begin", describe: "tuesday_from"},
                {id: "te-tuesday-end", describe: "tuesday_to"},
                {id: "te-wednesday-begin", describe: "wednesday_from"},
                {id: "te-wednesday-end", describe: "wednesday_to"},
                {id: "te-thursday-begin", describe: "thursday_from"},
                {id: "te-thursday-end", describe: "thursday_to"},
                {id: "te-friday-begin", describe: "friday_from"},
                {id: "te-friday-end", describe: "friday_to"},
                {id: "te-saturday-begin", describe: "saturday_from"},
                {id: "te-saturday-end", describe: "saturday_to"},
                {id: "te-sunday-begin", describe: "sunday_from"},
                {id: "te-sunday-end", describe: "sunday_to"},
              ],
            },
            {
              name: 'capability',
              ids: [
                {id: 'te-max-extensions', describe: 'max_extensions', type: 'Number'},
                {id: 'te-max-concurrent-calls', describe: 'max_concurrent_calls', type: 'Number'},
                {id: 'te-ring-groups', describe: 'max_ring_groups', type: 'Number'},
                {id: 'te-call-queues', describe: 'max_call_queues', type: 'Number'},
                {id: 'te-virtual-receptionists', describe: 'max_virtual_receptionists', type: 'Number'},
                {id: 'te-conference-rooms', describe: 'max_conference_rooms', type: 'Number'},
              ],
            },
            {
              name: 'profile',
              ids: [
                {id: 'te-first-name', describe: 'first_name'},
                {id: 'te-last-name', describe: 'last_name'},
                {id: 'te-company-name', describe: 'company_name'},
                {id: 'te-company-website', describe: 'company_website'},
                {id: 'te-email', describe: 'email'},
                {id: 'te-timezone', describe: 'timezone'},
                {id: 'te-currency', describe: 'currency'},
              ],
            },
          ]
        };

        function init(contentBox, option) {
          _this.initialize(contentBox, option);

          $('[data-role=timepicker]', contentBox).removeAttr('readonly');
          /**
           * Office Hours 页签 时间控件初始化
           */
          $('#eoh-radio-time-specific', contentBox).on('click', function () {
            $('[data-role=timepicker]', contentBox).removeAttr('readonly');
          });
          /**
           * Office Hours 选项卡时间控件
           */
          $('[data-role=timepicker]', contentBox).timepicker({'scrollDefault': 'now', timeFormat: 'H:i'});
          $('[data-time-add]', contentBox).on('click', function () {
            var timeId = $(this).attr('data-time-add');

            var begin = $('#' + timeId + '-begin').val();
            var end = $('#' + timeId + '-end').val();

            $('#' + timeId).val(begin + ' - ' + end);
          });
          $('[data-time-remove]', contentBox).on('click', function () {
            var timeId = $(this).attr('data-time-remove');
            $('#' + timeId).val('');
            $('#' + timeId + '-begin').attr('data-mark', 'default').val('');
            $('#' + timeId + '-end').attr('data-mark', 'default').val('');

          });
        }

        //新增
        $('#add-tenant', contentBox).on('click', function () {
          _this.get('/tenant/addTenant', function (contentBox) {

            init(contentBox, ['init', 'load', 'password']);

            $('#te-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/tenant/addTenant', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');

                    $('button[data-return]', contentBox).trigger('click');
                  }
                })
                .error(function (err) {
                  console.error('error');
                  console.error(err);
                });

            });

          })
        });

        //修改
        $('[name=te-btn-update]', contentBox).off('click').on('click', function () {
          var name = $(this).attr('data-value');
          var url = '/tenant/updateTenant';
          url = _this.util.parseURLGet(url, [{key: 'username', value: name}]);


          _this.get(url, function (contentBox) {

            init(contentBox, ['select', 'update', 'checkbox', 'load', 'password']);

            $('[data-time-add]').trigger('click');
            //,,,

            $('#te-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');

              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);

              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/tenant/updateTenant', reqJSON)
                .success(function (data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');

                    $('button[data-return]', contentBox).trigger('click');
                  }
                })
                .error(function (err) {
                  console.error(err);
                });

            });


          });
        });

        //删除
        $('[name=te-btn-delete]', contentBox).off('click').on('click', function () {
          var name = $(this).attr('data-value');
          var reqJSON = {username: name}
          reqJSON = _this.util.parseURLPost(reqJSON);
          $.post('/tenant/deleteTenant', reqJSON).success(function (data) {
            data = _this.util.parseJSON(data);
            if (data && data.err_code) {
              _this.show('warning', data.msg);

            } else {
              _this.show('success', 'Create is ok');

              _this.menuDescribe['te'](_this);
            }
          });

        });

        //....
      });
    },
    rm: function (_this) {

      (function recordingsShow(data) {

        var url = '/recordingsManagement';
        if (data) {
          //if(data.enable_filter_by_id)
          url = _this.util.parseURLGet(url, [
            {key: 'enable_filter_by_id', value: data.enable_filter_by_id},
            {key: 'filter_by_id_value', value: data.filter_by_id_value},
            {key: 'filter_by_id_type', value: data.filter_by_id_type},
            {key: 'enable_filter_by_date', value: data.enable_filter_by_date},
            {key: 'filter_by_date_from', value: data.filter_by_date_from},
            {key: 'filter_by_date_to', value: data.filter_by_date_to},
          ]);
        }

        _this.get(url, function (contentBox) {

          _this.initialize(contentBox, ['checkbox', 'select', 'update']);
          $('[data-role="datetime"]', contentBox).datetimepicker({format: 'DD/MM/YYYY'});

          var pargs = {
            name: 'default',
            ids: [
              {id: 'r-enable-id', describe: 'enable_filter_by_id'},
              {id: 'r-filter-id-value', describe: 'filter_by_id_value'},
              {id: 'r-filter-id-type', describe: 'filter_by_id_type'},
              {id: 'r-enable-data', describe: 'enable_filter_by_date'},
              {id: 'r-filter-from', describe: 'filter_by_date_from'},
              {id: 'r-filter-to', describe: 'filter_by_date_to'},
            ]
          };


          $('#r-btn-apply').off('click').on('click', function () {

            var reqJSON = _this.ready(pargs, contentBox);
            reqJSON = _this.util.parseURLPost(reqJSON);

            //console.log(reqJSON);

            recordingsShow(reqJSON);

          });


          $('[name=c-btn-delete]', contentBox).off('click').on('click', function () {
            var number = $(this).attr('data-number');
            var name = $(this).attr('data-name');

            var reqJSON = {extension_number: number, file_name: name};
            reqJSON = _this.util.parseURLPost(reqJSON);


            _this.AJAXPost('/recordingsManagement/delete', reqJSON)
              .success(function (data) {
                data = _this.util.parseJSON(data);
                console.log(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'Delete is ok');

                  _this.menuDescribe['ir'](_this);
                }
              });

          });

        });
      })();


    },
    cs: function (_this, page) {
      page = page || 1;
      var url = '/callSessions';
      url = _this.util.parseURLGet(url, [{key: 'page', value: page}]);
      _this.get(url, function (contentBox) {


        $('[name=cs-btn-delete]', contentBox).off('click').on('click', function () {

          var sessionId = $(this).attr('data-value');

          var reqJSON = {session_id: parseInt(sessionId)};
          reqJSON = _this.util.parseURLPost(reqJSON);


          _this.AJAXPost('/callSessions/stop', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['cs'](_this);
              }
            });

        });

        $('#cs-btn-refresh', contentBox).off('click').on('click', function () {
          _this.menuDescribe['cs'](_this);
        });

        //分页
        $('[data-role=page]', contentBox).off('click').on('click', function() {
          //var realUrl = url.substr(0, url.indexOf('?'));
          _this.menuDescribe['cs'](_this, $(this).attr('data-page'));
          return false;
        });


      });
    },
    cr: function (_this, page) {
      var crURL = '/callManager/callReports';
      if (page) crURL+= '?page=' + page;
      _this.get(crURL, function (contentBox) {
        
        var pargs={
          name:'default',
          ids:[
            {id: 'range_from-id', describe: 'date_from'},
            {id: 'range_to_id', describe: 'date_to'},
            {id: 'mail_to_id', describe: 'mail_to'},
            {id: 'cr-format', describe: 'format'},
            {name:'status-redio',describe:'call_status',type:'Number'}
          ],
          children:[
            {
              name: 'source',
              ids:[
                {name:'source-radio',type: "group",describe: ["source_type", "source_value"]}
              ]
            },
            {
              name: 'destination',
              ids:[
                {name:'destnation-radio',type: "group",describe: ["dest_type", "dest_value"]}
              ]
            },
           
            {
              name:'duration',
              ids:[
               {id:'duration_from_id',describe:'duration_from',type:'Number'},
               {id:'duration_to_id',describe:'duration_to',type:'Number'}
              ]
            }
          ]
        };
        $('#search', contentBox).on('click', function () {
          _this.get('/callManager/callReports/search', function (contentBox) {
            $('[data-role="datetime"]', contentBox).datetimepicker({
              format: 'MM/DD/YYYY HH:mm:ss',
              // disabledDates: new Date(),
              useCurrent: true,
            });
            $('#range_from-id', contentBox).on('dp.hide', function(e) {
              console.log('666');
              $('#range_to_id', contentBox).focus();
            });

            _this.initialize(contentBox,['init']);

             $('#ck-duration').off('click').on('click',function(){
                //console.log($(this).is(':checked'));
                var bool = $(this).is(':checked');
                if(!bool){
                $('[name=cr-duration]', contentBox).attr('data-mark', 'default').val('');
                }
                $('[name=cr-duration]', contentBox).attr('disabled', !bool);
            });

            $('#cr-apply',contentBox).off('click').on('click',function(){


              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);


              console.log(reqJSON);//test
              //return;//test

              loading.show();
              _this.AJAXPost('/callManager/callReports/search', reqJSON)
                .success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg || 'Inbound Create ERROR');
                } else {
                  _this.show('success', 'Create is ok');

                  $('#ir-cancel', contentBox).trigger('click');
                }
              });

            });



          });
        });

        $('#download', contentBox).on('click', function () {
          _this.get('/callManager/callReports/download', function (contentBox) {
            //...
          });
        });
        $('[data-toggle=modal]').on('click', function() {

          var url = '/callManager/callReports/show';
          url = _this.util.parseURLGet(url,[{key: 'call_id', value: $(this).attr('data-value')}]);
          _this.AJAXGet(url).success(function(data) {
            // data.trimData = _this.util.trimData;
            var modelHTML = ejs.render(data.modelHTML, {data: data.crData, trimDate: _this.util.trimDate});
            $('#model-box .modal-body', contentBox).html(modelHTML);
            return true;
          });
          // return false;
        });
        $('[data-page]').on('click', function() {
          if(!$(this).parent().hasClass('disabled')) {
            _this.menuDescribe['cr'](_this, $(this).attr('data-value'));
          }
        });

      });
    },
    bi: function (_this) {
      _this.get('/billing', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'bi-name', describe: 'name'},
            {id: 'bi-call-prefix', describe: 'call_prefix'},
            {id: 'bi-rate', describe: 'rate'},
            {id: 'bi-currency-unit', describe: 'currency_unit'},
            {id: 'bi-timing-unit', describe: 'timing_unit'},
          ]
        };

        $('#add-rate', contentBox).off('click').on('click', function() {

          _this.get('/billing/create', function(contentBox) {

            _this.initialize(contentBox, ['init', 'load']);

            $('#bi-apply', contentBox).off('click').on('click', function() {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);

              loading.show();
              console.log(reqJSON);
              _this.AJAXPost('/billing/create', reqJSON)
                .success(function(data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');
                    $('[data-return]button', contentBox).trigger('click');
                  }
                });



            });

          });



        });

        $('[name=bi-btn-update]', contentBox).off('click').on('click', function() {
          var curBtn = $(this);
          var reqData = [
            {key: 'name', value: curBtn.attr('data-name')},
            {key: 'call_prefix', value: curBtn.attr('data-call-prifix')},
            {key: 'rate', value: curBtn.attr('data-rate')},
            {key: 'currency_unit',value: curBtn.attr('data-currency-unit')},
            {key: 'timing_unit', value: curBtn.attr('data-timing-unit')},
          ];
          var url = _this.util.parseURLGet('/billing/update', reqData);
          _this.get(url, function(contentBox) {
            _this.initialize(contentBox, ['update', 'select', 'load']);

            $('#bi-apply', contentBox).off('click').on('click', function() {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);

              loading.show();
              _this.AJAXPost('/billing/update', reqJSON)
                .success(function(data) {
                  loading.hide();
                  data = _this.util.parseJSON(data);
                  if (data && data.err_code) {
                    _this.show('warning', data.msg);
                  } else {
                    _this.show('success', 'Create is ok');
                    $('[data-return]button', contentBox).trigger('click');
                  }
                });
            });

          });
        });

        $('[name=te-btn-delete]', contentBox).off('click').on('click', function() {
          var callPrefix = $(this).attr('data-value');
          var reqData = {
            call_prefix: callPrefix,
          };
          _this.AJAXPost('/billing/delete', reqData)
            .success(function(data) {
              data = _this.util.parseJSON(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Create is ok');

                _this.menuDescribe['bi'](_this);
              }
            });

        });

      });
    },
    st: function (_this) {
      _this.get('/settings', function (contentBox) {
        _this.initialize(contentBox, ['checkbox', 'select', 'disabled', 'load']);
        //$('[data-role=timepicker]', contentBox).timepicker({'scrollDefault': 'now', timeFormat: 'H:i'});

        var pargs = {
          name: 'default',
          children: [
            {
              name: 'general',
              ids: [
                {id: 'ss-message-log', describe: 'enable_sip_message_log'},
                {id: 'ss-ipv6', describe: 'enable_ipv6'},
                {id: 'ss-digest-auth', describe: 'enable_digest_auth' },
                {id: 'ss-auth-int-dialog', describe: 'enable_digest_auth_int'},
                {id: 'ss-auth-mid-dialog', describe: 'enable_auth_mid_dialog'},
                {id: 'ss-reject-bad-nonce', describe: 'enable_reject_bad_nonce'},
                {id: 'ss-tag-in-reqister', describe: 'enable_to_tag_in_register'},
                {id: 'ss-statistics-log', describe: 'statistics_log_interval', type: 'Number'},
                {id: 'ss-congestion-management', describe: 'enable_congestion_management'},
                {id: 'ss-congestion-metric', describe: 'congestion_management_metric', type: 'Number'},
                {id: 'ss-congestion-tolerance', describe: 'congestion_management_tolerance', type: 'Number'},
                {id: 'ss-create-non-exist-extension', describe: 'enable_create_non_exist_extension'},
                {id: 'ss-session-timeout', describe: 'dead_session_timeout', type: 'Number'},
                {id: 'ss-session-timer', describe: 'enable_session_timer'},
                {id: 'ss-session-timer-duration', describe: 'session_timer_duration', type: 'Number'},
                {name: 'ss-presence-mode', describe: 'presence_mode'},
                {id: 'ss-primary-dns', describe: 'primary_dns_server'},
                {id: 'ss-secondary-dns', describe: 'secondary_dns_server'},
              ]
            },
            {
              name: 'quota',
              ids: [
                {id: 'ss-max-recordings', describe: 'max_recordings_quota', type: 'Number'},
                {id: 'ss-used-recordings', describe: 'used_recordings_quota', type: 'Number'},
                {id: 'ss-max-voicemail', describe: 'max_voicemail_quota', type: 'Number'},
                {id: 'ss-used-voicemail', describe: 'used_voicemail_quota', type: 'Number'},
                {id: 'ss-cleaning-recordings', describe: 'enable_auto_cleaning_recordings'},
                {id: 'ss-cleaning-recordings-day', describe: 'auto_cleaning_recordings_days', type: 'Number'},
                {id: 'ss-cleaning-voicemail', describe: 'enable_auto_cleaning_voicemail'},
                {id: 'ss-cleaning-voicemail-day', describe: 'auto_cleaning_voicemail_days', type: 'Number'},
                {id: 'ss-cleaning-logs', describe: 'enable_auto_cleaning_logs'},
                {id: 'ss-cleaning-logs-day', describe: 'auto_cleaning_logs_days', type: 'Number'},
              ]
            },
            {
              name: 'paging_intercom',
              ids: [
                {id: 'ss-dial-code', describe: 'dial_code'},
                {id: 'ss-alert-info-header', describe: 'auto_answer_alert_info_header', type: 'Number'},
                {id: 'ss-auto-answer', describe: 'enable_auto_answer_call_info_header'},
                {id: 'ss-answer-mode', describe: 'enable_require_answer_mode'},
              ]
            }
          ],
        };


        $('#ss-apply', contentBox).off('click').on('click', function () {

          var loading = $('#'+$(this).attr('id')+'-loading');

          var reqJSON = _this.ready(pargs, contentBox);
          reqJSON = _this.util.parseURLPost(reqJSON);
          console.log(reqJSON);

          ///settings/update

          loading.show();
          _this.AJAXPost('/settings/update', reqJSON).success(function (data) {
            loading.hide();
            data = _this.util.parseJSON(data);
            if (data && data.err_code) {
              _this.show('warning', data.msg);
            } else {
              _this.show('success', 'update is ok');

              _this.menuDescribe['st'](_this);
            }
          });

        });


      });
    },
    ms: function (_this) {
      _this.get('/settings/mediaServer', function (contentBox) {

        _this.initialize(contentBox, ['switchery']);

        var pargs = {
          name: 'default',
          ids: [
            {id: 'ms-name', describe: 'name'},
            {id: 'ms-ip', describe: 'ip'},
            {id: 'ms-port', describe: 'port', type: 'Number'},
            {id: 'ms-enable', describe: 'enable'},

            {id: 'ms-max-concurrent', describe: 'max_concurrent_sessions', type: 'Number'},
            {id: 'ms-call-sessions', describe: 'active_call_sessions'},
            {id: 'ms-cpu', describe: 'cpu_usage'},
            {id: 'ms-memory', describe: 'memory_usage'},
          ]
        };


        $('#add-server', contentBox).on('click', function () {
          _this.get('/settings/mediaServer/addServer', function (contentBox) {

            _this.initialize(contentBox, ['load']);

            $('#ms-btn-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/settings/mediaServer/addServer', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'create is ok');

                  //_this.menuDescribe['st'](_this);
                  $('button[data-return=ms]', contentBox).trigger('click');
                }
              });
            });

          })
        });

        $('[name=ms-btn-edit]', contentBox).off('click').on('click', function () {

          var hiddenBtn = $('#ms-hidden-' + $(this).attr('data-value'));
          var ip = hiddenBtn.attr('data-ip');
          var name = hiddenBtn.attr('data-name');
          var port = hiddenBtn.attr('data-port');
          //var port = 8894;  //初定 固定端口


          var url = '/settings/mediaServer/updateServer';
          url = _this.util.parseURLGet(url, [
            {key: 'name', value: name},
            {key: 'ip', value: ip},
            {key: 'port', value: port}
          ]);

          _this.get(url, function (contentBox) {

            _this.initialize(contentBox, ['update', 'load']);

            $('#ms-btn-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');

              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);

              loading.show();
              _this.AJAXPost('/settings/mediaServer/updateServer', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'update is ok');

                  $('button[data-return=ms]', contentBox).trigger('click');
                }
              });

            });

          });


        });

        $('[name=ms-btn-delete]', contentBox).off('click').on('click', function () {


          var reqJSON = {name: $(this).attr('data-value')};
          reqJSON = _this.util.parseURLPost(reqJSON);

          console.log(reqJSON);

          _this.AJAXPost('/settings/mediaServer/destroyServer', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['ms'](_this);
              }
            });

        });

        $('[name=ms-btn-enabled]', contentBox).off('change').on('change', function() {



          var reqJSON = {
            name: $(this).attr('data-name'),
            enabled: this.checked,
          };
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/settings/mediaServer/updateServer', reqJSON).success(function (data) {
            data = _this.util.parseJSON(data);
            if (data && data.err_code) {
              _this.show('warning', data.msg);
            } else {
              _this.show('success', 'update is ok');

              _this.menuDescribe['ms'](_this);
            }
          });


        });

      });
    },
    cse: function (_this) {
      _this.get('/settings/conferenceServer', function (contentBox) {

        var pargs = {
          name: 'default',
          ids: [
            {id: 'cse-name', describe: 'name'},
            {id: 'cse-ip', describe: 'ip'},
            {id: 'cse-port', describe: 'port', type: 'Number'},
            {id: 'cse-maximum-rooms', describe: 'max_rooms', type: 'Number'},
            {id: 'cse-maximum-participants', describe: 'max_participants', type: 'Number'},
          ],
        };

        $('#add-server', contentBox).on('click', function () {
          _this.get('/settings/conferenceServer/addServer', function (contentBox) {

            _this.initialize(contentBox, ['load']);

            $('#cse-btn-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              loading.show();
              _this.AJAXPost('/settings/conferenceServer/addServer', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'create is ok');

                  //_this.menuDescribe['st'](_this);
                  $('button[data-return=cse]', contentBox).trigger('click');
                }
              });
            });

          });
        });

        $('[name=cse-btn-edit]', contentBox).off('click').on('click', function () {


          var hiddenBtn = $('#cse-hidden-' + $(this).attr('data-value'));
          var ip = hiddenBtn.attr('data-ip');
          var name = hiddenBtn.attr('data-name');
          //var port = hiddenBtn.attr('data-port');
          var port = 8878;  //初定 固定端口

          var url = '/settings/conferenceServer/updateServer';
          url = _this.util.parseURLGet(url, [
            {key: 'name', value: name},
            {key: 'ip', value: ip},
            {key: 'port', value: port}
          ]);

          _this.get(url, function (contentBox) {

            _this.initialize(contentBox, ['update', 'load']);

            $('#cse-btn-apply', contentBox).off('click').on('click', function () {
              var loading = $('#'+$(this).attr('id')+'-loading');

              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              reqJSON.ip = ip;
              reqJSON.port = port;
              reqJSON.name = name;

              loading.show();
              _this.AJAXPost('/settings/conferenceServer/updateServer', reqJSON).success(function (data) {
                loading.hide();
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'update is ok');

                  $('button[data-return=cse]', contentBox).trigger('click');
                }
              });

            });

          });

        });

        $('[name=cse-btn-delete]', contentBox).off('click').on('click', function () {

          var hiddenBtn = $('#cse-hidden-' + $(this).attr('data-value'));
          var ip = hiddenBtn.attr('data-ip');
          var name = hiddenBtn.attr('data-name');
          //var port = hiddenBtn.attr('data-port');
          var port = 8878;  //初定 固定端口
          var reqJSON = {
            name: $(this).attr('data-name'),
            ip: ip,
            port:port
          };
          reqJSON = _this.util.parseURLPost(reqJSON);

          console.log('^^^^^^^^');
          console.log(reqJSON);

          _this.AJAXPost('/settings/conferenceServer/deleteServer', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['cse'](_this);
              }
            });

        });

        $('#cse-btn-refresh', contentBox).off('click').on('click', function () {

          _this.menuDescribe['cse'](_this);

        });

        //$('[name=ms-btn-enabled]', contentBox).off('change').on('change', function() {
        //
        //
        //
        //  var reqJSON = {
        //    name: $(this).attr('data-name'),
        //    enabled: this.checked,
        //  };
        //  reqJSON = _this.util.parseURLPost(reqJSON);
        //
        //  _this.AJAXPost('/settings/conferenceServer/updateServer', reqJSON).success(function (data) {
        //    data = _this.util.parseJSON(data);
        //    if (data && data.err_code) {
        //      _this.show('warning', data.msg);
        //    } else {
        //      _this.show('success', 'update is ok');
        //
        //      _this.menuDescribe['ms'](_this);
        //    }
        //  });
        //
        //
        //});


      });

    },
    ss: function (_this) {
      _this.get('/settings/servicesStatus', function (contentBox) {


        _this.initialize(contentBox, ['switchery']);


        $('#ss-btn-reresh', contentBox).off('click').on('click', function () {

          _this.menuDescribe['ss'](_this);

        });

        $('[name=ss-btn-enabled]', contentBox).off('click').on('click', function () {

          var btn = $('input', this);
          var span = $('span', this);

          var reqJSON = {op: btn.attr('data-value') == 'true' ? 2 : 1, service_id: btn.attr('data-id')};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/settings/servicesStatus/update', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
                _this.menuDescribe['ss'](_this);
              } else {
                _this.show('success', 'Operation is ok');

                _this.menuDescribe['ss'](_this);
              }
            });

        });

        $('[name=ss-btn-Restart]', contentBox).off('click').on('click', function () {
          var reqJSON = {op: 3, service_id: $(this).attr('data-value')};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/settings/servicesStatus/update', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
                _this.menuDescribe['ss'](_this);
              } else {
                _this.show('success', 'Operation is ok');

                _this.menuDescribe['ss'](_this);
              }
            });
        });

      });

    },
    nb: function (_this) {
      _this.get('/settings/numberBlacklist', function (contentBox) {


        var pargs = {
          name: 'default',
          ids: [
            {id: 'nbs-number', describe: 'black_number'},
            {id: 'nbs-description', describe: 'description'},
          ]
        };

        $('#add-blacklist', contentBox).on('click', function () {
          _this.get('/settings/numberBlacklist/create', function (contentBox) {
            _this.initialize(contentBox);

            $('#nbs-btn-apply', contentBox).off('click').on('click', function () {
              var reqJSON = _this.ready(pargs, contentBox);
              reqJSON = _this.util.parseURLPost(reqJSON);
              console.log(reqJSON);

              _this.AJAXPost('/settings/numberBlacklist/create', reqJSON).success(function (data) {
                data = _this.util.parseJSON(data);
                if (data && data.err_code) {
                  _this.show('warning', data.msg);
                } else {
                  _this.show('success', 'create is ok');

                  //_this.menuDescribe['st'](_this);
                  $('button[data-return=nb]', contentBox).trigger('click');
                }
              });
            });

          });
        });

        $('[name=nb-btn-delete]', contentBox).off('click').on('click', function () {
          var number = $(this).attr('data-value');
          var reqJSON = {black_number: number};
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/settings/numberBlacklist/delete', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              console.log(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
                _this.menuDescribe['ss'](_this);
              } else {
                _this.show('success', 'Delete is ok');

                _this.menuDescribe['nb'](_this);
              }
            });


        });


      });

    },
    li: function (_this) {
      _this.get('/settings/license', function (contentBox) {
        _this.initialize(contentBox, ['update']);


        var pargs = {
          name: 'default',
          ids: [
            {id: 'li-key', describe: 'version'},
          ]
        };
        $('#li-apply', contentBox).off('click').on('click', function () {
          var reqJSON = _this.ready(pargs, contentBox);
          reqJSON = _this.util.parseURLPost(reqJSON);

          _this.AJAXPost('/settings/license/update', reqJSON).success(function (data) {
            data = _this.util.parseJSON(data);
            if (data && data.err_code) {
              _this.show('warning', data.msg);
            } else {
              _this.show('success', 'create is ok');

              //_this.menuDescribe['st'](_this);
              $('button[data-return=nb]', contentBox).trigger('click');
            }
          });
        });

      });

    },
    pf: function (_this) {
      _this.get('/profile', function (contentBox) {

        var role = $.cookie('role');

        function init(contentBox, option) {
          _this.initialize(contentBox, option);

          $('[data-role=timepicker]', contentBox).removeAttr('readonly');
          /**
           * Office Hours 页签 时间控件初始化
           */
          $('#eoh-radio-time-specific', contentBox).on('click', function () {
            $('[data-role=timepicker]', contentBox).removeAttr('readonly');
          });
          /**
           * Office Hours 选项卡时间控件
           */
          $('[data-role=timepicker]', contentBox).timepicker({'scrollDefault': 'now', timeFormat: 'H:i'});
          $('[data-time-add]', contentBox).on('click', function () {
            var timeId = $(this).attr('data-time-add');

            var begin = $('#' + timeId + '-begin').val();
            var end = $('#' + timeId + '-end').val();

            $('#' + timeId).val(begin + ' - ' + end);
          });
          $('[data-time-remove]', contentBox).on('click', function () {
            var timeId = $(this).attr('data-time-remove');
            $('#' + timeId).val('');
            $('#' + timeId + '-begin').attr('data-mark', 'default').val('');
            $('#' + timeId + '-end').attr('data-mark', 'default').val('');

          });
        }

        init(contentBox, ['update', 'select', 'password']);

        var pargs = {
          name: 'default',
          ids: [
            {id: 'te-username', describe: 'username'},
            {id: 'te-password', describe: 'password'},
          ],
          children: [
            {
              name: 'office_hours',
              ids: [
                {id: "te-monday-begin", describe: "monday_from"},
                {id: "te-monday-end", describe: "monday_to"},
                {id: "te-tuesday-begin", describe: "tuesday_from"},
                {id: "te-tuesday-end", describe: "tuesday_to"},
                {id: "te-wednesday-begin", describe: "wednesday_from"},
                {id: "te-wednesday-end", describe: "wednesday_to"},
                {id: "te-thursday-begin", describe: "thursday_from"},
                {id: "te-thursday-end", describe: "thursday_to"},
                {id: "te-friday-begin", describe: "friday_from"},
                {id: "te-friday-end", describe: "friday_to"},
                {id: "te-saturday-begin", describe: "saturday_from"},
                {id: "te-saturday-end", describe: "saturday_to"},
                {id: "te-sunday-begin", describe: "sunday_from"},
                {id: "te-sunday-end", describe: "sunday_to"},
              ],
            },
            {
              name: 'capability',
              ids: [
                {id: 'te-max-extensions', describe: 'max_extensions', type: 'Number'},
                {id: 'te-max-concurrent-calls', describe: 'max_concurrent_calls', type: 'Number'},
                {id: 'te-ring-groups', describe: 'max_ring_groups', type: 'Number'},
                {id: 'te-call-queues', describe: 'max_call_queues', type: 'Number'},
                {id: 'te-conference-rooms', describe: 'max_conference_rooms', type: 'Number'},
                {id: 'te-virtual-receptionists', describe: 'max_virtual_receptionists', type: 'Number'},
              ],
            },
            {
              name: 'profile',
              ids: [
                {id: 'te-first-name', describe: 'first_name'},
                {id: 'te-last-name', describe: 'last_name'},
                {id: 'te-company-name', describe: 'company_name'},
                {id: 'te-company-website', describe: 'company_website'},
                {id: 'te-email', describe: 'email'},
                {id: 'te-timezone', describe: 'timezone'},
                {id: 'te-currency', describe: 'currency'},
              ],
            },
            {
              name: 'mail_server',
              ids: [
                {id: 'te-smtp-server', describe: 'smtp_server'},
                {id: 'te-smtp-server-port', describe: 'smtp_server_port'},
                {id: 'te-email-address', describe: 'reply_email_address'},
                {id: 'te-server-username', describe: 'username_for_smtp_server'},
                {id: 'te-server-password', describe: 'password_for_smtp_server'},
                {id: 'te-enable-ssl-tls', describe: 'enable_ssl_tls'},
              ]
            }
          ]
        };

        $('#profile-apply', contentBox).off('click').on('click', function () {

          var reqJSON = _this.ready(pargs, contentBox);
          reqJSON = _this.util.parseURLPost(reqJSON);

          console.log(reqJSON);

          _this.AJAXPost('/profile/update', reqJSON)
            .success(function (data) {
              data = _this.util.parseJSON(data);
              if (data && data.err_code) {
                _this.show('warning', data.msg);
              } else {
                _this.show('success', 'Create is ok');

                _this.menuDescribe['pf'](_this);
              }
            })
            .error(function (err) {
              console.error(err);
            });

        });

        if (role !== 'administrator') {
          $('[name=profile-capability]', contentBox).attr('disabled', true);
        }


      });
    }

  },
  resources: {}
});




















