import React, { Component, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, Layout, Input, Button, message,Modal,Upload } from 'antd';
import { PictureTwoTone, SmileTwoTone, BoldOutlined, ItalicOutlined, UnderlineOutlined,UploadOutlined, ContactsOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import ajax from '../../../Util/ajax'

export default function CreateArticle() {

  const [tabkey, setTabkey] = useState(null)
  const [headerValue, setHeaderValue] = useState('')
  const [contentValue, setContentValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      getBase64(info.file.originFileObj, (url) => {
        setContentValue({...contentValue},url)
        setIsModalOpen(false)
      })
      message.success(`上传成功`);
      console.log(info.file)
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
            <PictureTwoTone style={{ width: 26, height: 23 }} onClick={showModal}/>
            <Modal title="插入图片" visible={isModalOpen} footer={false}>

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

            <SmileTwoTone />
            <BoldOutlined />
            <ItalicOutlined />
            <UnderlineOutlined />
          </div>
          <Input.TextArea className={styles.articleDescriptionCreate} style={{
            height: 412,
          }} onChange={showContentValue} value={contentValue}></Input.TextArea>
          <div className={styles.buttonWrapper}>   <Button type='primary' className={styles.button} onClick={onClick}>发布</Button></div>
        </Layout.Content>
      </div>
    </>
  )
}

