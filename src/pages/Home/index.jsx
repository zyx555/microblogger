import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import { Button, Tabs, Layout, Space, Avatar, Card, Col, Row, Modal, Input, List, message, Upload, Form } from 'antd'
import { ConsoleSqlOutlined, FormOutlined, InfoCircleFilled, UploadOutlined } from '@ant-design/icons'
import 'antd/dist/antd.min.css'
import styles from './index.module.css'
import ajax from '../../Util/ajax'

import logo from '../Home/书籍2.png'
const { TabPane } = Tabs;
const { Sider, Content } = Layout

const panes = [
  { title: '关注', key: '/home/follow' },
  { title: '推荐', key: '/home/recommend' }
]
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};


class home extends Component {
  state = {
    data: '',
    user: '',
    id: '',
    columnList: '',
    newRead: '',
    newFollow: '',
    tabkey: 'recommend',
    isModalVisible: false,
    columnHeaderValue: '',
    columnDescriptionValue: '',
    headImgUrl: '',
    fileData: ''

  }


  componentDidMount = () => {
    ajax("GET",
      '/weiboke/user?userId=7').then((res) => {
        this.setState({
          data: [res.data],
          user: res.data.user,
          headImgUrl: res.data.user.headUrl,
          columnList: res.data.columnList,
          newRead: res.data.newRead,
          newFollow: res.data.newFollow,
          id: res.data.user.id
        })
        console.log(this.state.data)
        console.log(this.state.user)
      })
  }
  handleClick = () => {
    window.location.href = '/home/specials'
  }
  handleChange = (key) => {
    this.setState({
      tabkey: key
    })
    window.location.href = '/home/' + key
  }
  showModal = () => {
    this.setState({
      isModalVisible: true
    })
  }
  showColumnDsecriptionValue = (e) => {
    this.setState({
      columnDescriptionValue: e.target.value
    })
  }
  showColumnHeaderValue = (e) => {
    this.setState({
      columnHeaderValue: e.target.value
    })

  }
  handleOk = () => {
    this.setState({
      isModalVisible: false
    })
    console.log(this.state.columnHeaderValue)
    ajax('Post', `/weiboke/creation/column?title=${this.state.columnHeaderValue}&introduction=${this.state.columnDescriptionValue}&userId=7`).then((res) => {
      message.success(res.status_msg)
      window.location.href = '/home/recommend'
    })
  }
  handleCancel = () => {
    this.setState({
      isModalVisible: false
    })
  }
  handleCreateArticle = (id) => {

    window.location.href = `/createArticle/${id}`
  }

  ShowModal = () => {
    this.setState({
      IsModalVisible: true
    })
  }

  onChange = (info) => {
    if (info.file.status !== 'uploading') {

      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        this.setState({
          headImgUrl: url,
          IsModalVisible: false
        }
        )
      })
      message.success(`更改头像成功`);
      console.log(info.file)
    } else if (info.file.status === 'error') {
      this.setState({
        IsModalVisible: false
      }
      )
      message.error(`更改头像失败`);
    }
  }
  HandleCancel = () => {
    this.setState({
      IsModalVisible: false
    })
  }

  render() {
    const { data, user, headImgUrl, id, columnList, newRead, newFollow, columnHeaderValue, columnDescriptionValue } = this.state


    return (
      <div>

        <Tabs
          activeKey={this.state.tabkey}
          onTabClick={(key) => this.handleChange(key)}
          size='large'
          centered='true'
          tabBarGutter={73}>
          <TabPane tab='关注' key='follow'>
            <Outlet />
          </TabPane>
          <TabPane tab="推荐" key='recommend'>
            <Outlet />
          </TabPane>
        </Tabs>
        <Sider className={styles.siderRight} width={471}>
          <div className={styles.iconHeader}> <FormOutlined className={styles.icon} /> <span className={styles.iconDescriptio} >创作中心</span></div>
          <div style={{ width: 390, marginLeft: 40, marginBottom: 17 }}>
            <Avatar src={headImgUrl} size={48} onClick={this.ShowModal} />
            <span style={{ fontSize: 20, marginLeft: 20 }} >{user.username}</span>
          </div>

          <Modal title="更改头像" visible={this.state.IsModalVisible} footer={false}>

            <Upload
              name="file"
              headers={{ authorization: "authorization-text" }}


              maxCount={1}
              action={`/weiboke/static/Image/head?userId=${id}`}
              method='post'

              onChange={this.onChange}
            >
              <Button icon={<UploadOutlined />} >点击上传头像</Button>
            </Upload>

          </Modal>

          <div className={styles.cardContent}>

            <Card style={{ display: 'flex' }} size={80}>
              <Row gutter={16}>

                <Card.Meta title="总关注量" description={user.followCount} ></Card.Meta>

                <Card.Meta title="总阅读量" description={user.readCount}></Card.Meta>

              </Row>
              <Row gutter={16}>
                <Card.Meta title="今日新增关注量" description={newFollow}></Card.Meta>
                <Card.Meta title="今日新增阅读量" description={newRead}></Card.Meta>
              </Row>
            </Card>

          </div>
          <div className={styles.logoHeader}>

            <img className={styles.logo} src={logo}></img>
            <span className={styles.logoDescription}>专栏</span>
          </div>
          <Layout className={styles.columns}>
            <Content >
              <div className={'wrapper'} onClick={this.handleClick}>
                <List
                  size='small'

                  className={styles.content}
                  split={true}
                  dataSource={columnList}
                  renderItem={(columnList) =>
                    <List.Item key={columnList.id} className={styles.columns}>

                      <Button type="primary" className={styles.createArticle} onClick={this.handleCreateArticle.bind(columnList, columnList.id)}><span style={{ marginLeft: -13, color: 'black' }}>+创作</span></Button>
                      <Avatar className={styles.columnsAvatar} shape="square" src={columnList.coverUrl}></Avatar>
                      <List.Item.Meta

                        title={columnList.title}
                        description={
                          [
                            `作品：${columnList.articleCount}`,
                            `阅读量：${columnList.readCount}`
                          ]}
                      />
                    </List.Item>
                  }
                />
              </div>
            </Content>
          </Layout>
          <Layout className={styles.creation} onClick={this.showModal}>
            <Content >
              +创建一个新的专栏
            </Content>
          </Layout>
          <Modal

            visible={this.state.isModalVisible}
            okText={'创建'} onOk={this.handleOk}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { borderRadius: 50, width: 100, fontSize: 20, height: 26, lineHeight: '2px', left: -200 } }}
          >
            <div >
              <span className={styles.creations}>专栏标题</span>
              <Input className={styles.columnsHeaderCreate} onChange={this.showColumnHeaderValue} value={columnHeaderValue} /></div>
            <div style={{ marginTop: 40 }}>
              <span className={styles.creations} style={{ position: 'relative', top: -130 }}>简&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;介</span>
              <Input.TextArea
                style={{
                  height: 160,
                }} className={styles.columnsDescriptionCreate}
                onChange={this.showColumnDsecriptionValue}
                value={columnDescriptionValue}
              /></div>

          </Modal>
        </Sider>

      </div>
    )
  }
}
export default home
