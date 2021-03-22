import axios from 'axios'

export function getStory(id, params = { parser: 'yaml' }) {
  console.info('getStory URL:', `/api/story/${id}`, params)
  return axios.get(`/api/story/${id}`, params)
}

export function getStories(params = { parser: 'yaml' }) {
  console.info('getStories URL:', `/api/story/`, params)
  return axios.get(`/api/story/`, { params }).then((res) => {
    return res.data
  })
}
