import React, { Component } from 'react';
import { Layout, Avatar, List } from 'antd';
import { FormOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.module.css'
import ajax from '../../../Util/ajax'
const { Content } = Layout

export default class follow extends Component {
  state = {
    data: ''
  }
  handleClick = () => {
    window.location.href = '/home/passages'
  }
  componentDidMount = () => {
    ajax('Get', '/weiboke/follow/articlelist?user_id=7').then((res) => {
      this.setState({
        data: res.data
      })
      console.log(res.data)
    })
  }
  render() {
    const { data } = this.state
    return (
      <>
        <div className={'shell'} onClick={this.handleClick}>
          <Layout>
            <Content>
              <List
                size='small'
                className={styles.content}
                style={{ width: 613, marginLeft: 0, height: 168, borderRadius: 17, backgroundColor: 'white' }}
                split={false}
                dataSource={data}
                renderItem={(data) =>
                  <List.Item >
                    <Avatar size={48} src={data.user.headUrl} />
                    <span className={styles.userName} >{data.user.username}</span>
                    <span className={styles.articleTitle} >{data.article.articleTitle}</span>
                    <span className={styles.columnTitle}>——{data.article.columnTitle}</span>
                    <List.Item.Meta
                      description={data.article.content}


                    />
                  </List.Item>
                }
              />
            </Content>
          </Layout>
        </div>
      </>
    )
  }
}
