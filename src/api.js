import axios from 'axios'

export function getStory(id, params = { parser: 'yaml' }, timeout = 0) {
  console.info('getStory URL:', `/api/story/${id}`, params)
  return axios
    .get(`/api/story/${id}`, { params, timeout })
    .then(({ data }) => data)
}

export function getStories(params = { parser: 'yaml' }) {
  console.info('getStories URL:', `/api/story/`, params)
  return axios.get(`/api/story/`, { params }).then((res) => {
    return res.data
  })
}

export function getDocument(id) {
  console.info('getDocument URL:', `/api/document/${id}`)
  return axios.get(`/api/document/${id}`).then((res) => res.data)
}

export function getDocuments(params) {
  return axios.get(`/api/document/`, { params }).then((res) => {
    return res.data
  })
}
