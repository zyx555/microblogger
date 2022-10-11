import React, { Component, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, Layout, Input, Button, message, Modal, Upload, Col, Row } from 'antd';
import { PictureTwoTone, SmileTwoTone, BoldOutlined, ItalicOutlined, UnderlineOutlined, UploadOutlined, ContactsOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import ajax from '../../../Util/ajax'

export default function CreateArticle() {

  const [tabkey, setTabkey] = useState(null)
  const [headerValue, setHeaderValue] = useState('')
  const [contentValue, setContentValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clsName, setClsName] = useState(styles.articleDescriptionCreate)
  const [imgCode,setImgCode]=useState()
  const emojiList = [
    { id: 1, emoji: '😀' },
    { id: 2, emoji: '😅' },
    { id: 3, emoji: '😁' },
    { id: 4, emoji: '😂' },
    { id: 5, emoji: '🤣' },
    { id: 6, emoji: '🙃' },
    { id: 7, emoji: '🙂' },
    { id: 8, emoji: '😍' },
    { id: 9, emoji: '😚' },
    { id: 10, emoji: '🤑' },
  ]
  const { id } = useParams()
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleClick = (key) => {
    setTabkey(key)
    window.location.href = '/home/' + key
  }
  const showHeaderValue = (e) => {
    setHeaderValue(e.target.value)
  }
  const showContentValue = (e) => {
    setContentValue(e.target.value)
  }
  const showModal = () => {
    setIsModalOpen(true);
  };
  const ShowModal = () => {
    setIsModalVisible(true);
  };
  const handleOkEmoji = (item) => {
    setContentValue(contentValue + item)
    setIsModalVisible(false);
  };

  const handleCancelEmoji = () => {
    setIsModalVisible(false);
  };
  const handleBold = () => {
    setClsName(styles.boldArticleDescriptionCreate)

  }
  const handleItalic = () => {
    setClsName(styles.italicArticleDescriptionCreate)
  }
  const handleUnderline = () => {
    setClsName(styles.underlineArticleDescriptionCreate)
  }
  const onClick = () => {
    ajax('Post', `/weiboke/creation/article?title=${headerValue}&content=${contentValue}&columnId=${id}&userId=7`).then((res) => {
      message.success(res.status_msg)
      window.location.href = '/home/recommend'
    })

  }
  const onChange = (info) => {
    if (info.file.status !== 'uploading') {

      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // getBase64(info.file.originFileObj, (url) => {
      //   setContentValue(contentValue + url)
      //   setIsModalOpen(false)
      // })
      ajax('get',`/weiboke/static/Image/${info.file.name}`).then((res)=>{
        console.log(res.json())
       
      })
      setImgCode(`http://47.108.218.136:8445/weiboke/static/Image/${info.file.name}`)
      setContentValue(contentValue +  <img src={imgCode} alt='img'/>)
      setIsModalOpen(false)
      message.success(`上传成功`);
      console.log(info.file.name)
    } else if (info.file.status === 'error') {
      message.error(`上传失败`);
    }
  }

  return (
    <>
      <div className={'wrapper'}>
        <Tabs
          activeKey={tabkey}
          onTabClick={key => { handleClick(key) }}
          size='large'
          centered='true'
          tabBarGutter={73}

        >
          <Tabs.TabPane tab="关注" key="follow" >

          </Tabs.TabPane>
          <Tabs.TabPane tab="推荐" key="recommend" >

          </Tabs.TabPane>

        </Tabs>
        <Layout.Content>
          <div><Input placeholder="标题" className={styles.header} onChange={showHeaderValue} value={headerValue}></Input></div>
          <div className={styles.icons}>
            <PictureTwoTone style={{ width: 26, height: 23 }} onClick={showModal} />
            <Modal title="插入图片" visible={isModalOpen} footer={false} closable={true}>

              <Upload
                name="file"
                headers={{ authorization: "authorization-text" }}
                maxCount={1}
                action={`/weiboke/static/Image/article?`}
                method='post'

                onChange={onChange}
              >
                <Button icon={<UploadOutlined />} >点击上传图片</Button>
              </Upload>

            </Modal>

            <SmileTwoTone onClick={ShowModal} />
            <Modal title="添加表情" visible={isModalVisible} onOk={handleOkEmoji} okText={'确定'} onCancel={handleCancelEmoji} cancelText={'取消'}>
              <Row gutter={0}>
                {emojiList.map((item) => {
                  return (
                    <Col span={2} onClick={() => { handleOkEmoji(item.emoji); }} key={item.id}>
                      <div>{item.emoji}</div>
                    </Col>
                  )
                })}
              </Row>
            </Modal>
            <BoldOutlined onClick={handleBold} />
            <ItalicOutlined onClick={handleItalic} />
            <UnderlineOutlined onClick={handleUnderline} />
            {imgCode? <img src={imgCode} alt='img' style={{width:50,height:50}}/>:1}
          </div>
          <Input.TextArea
            className={clsName}
            style={{ height: 412, }}
            onChange={showContentValue}
            value={contentValue}
          >
           
          </Input.TextArea>
          <div className={styles.buttonWrapper}>   <Button type='primary' className={styles.button} onClick={onClick}>发布</Button></div>
        </Layout.Content>
      </div>
    </>
  )
}

