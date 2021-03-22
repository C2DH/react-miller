import { useEffect, useRef } from 'react'
import { shouldRunDeps, getRunValuesFromDeps } from 'rocketjump-core'
import { shallowEqualArrays, shallowEqualObjects } from 'shallow-equal'

function compareFacetsByKey(fkA, fkB) {
  // Compare as array
  if (Array.isArray(fkA) && Array.isArray(fkB)) {
    return shallowEqualArrays(fkA, fkB)
  }
  // Compare as value (expect to be boolean)
  if (typeof fkA === typeof fkB) {
    return fkA === fkB
  }
  // Type mismatch
  return false
}

export function compareDocumentsParams(paramsA, paramsB) {
  if (paramsA === paramsB) {
    return true
  }
  if (!paramsA || !paramsB) {
    return false
  }
  // Extract miller non scalar params
  const {
    facets: facetsA,
    filters: filtersA,
    exclude: excludeA,
    facetsByKey: facetsByKeyA,
    ...otherParamsA
  } = paramsA
  const {
    facets: facetsB,
    filters: filtersB,
    exclude: excludeB,
    facetsByKey: facetsByKeyB,
    ...otherParamsB
  } = paramsB
  // Shallow compare them
  if (!compareFacetsByKey(facetsByKeyA, facetsByKeyB)) {
    return false
  }
  if (!shallowEqualArrays(facetsA, facetsB)) {
    return false
  }
  if (!shallowEqualObjects(filtersA, filtersB)) {
    return false
  }
  if (!shallowEqualObjects(excludeA, excludeB)) {
    return false
  }
  // Shallow compare extra params
  return shallowEqualObjects(otherParamsA, otherParamsB)
}

export function compareMillerParams(paramsA, paramsB) {
  if (paramsA === paramsB) {
    return true
  }
  if (!paramsA || !paramsB) {
    return false
  }
  // Extract miller non scalar params
  const { filters: filtersA, exclude: excludeA, ...otherParamsA } = paramsA
  const { filters: filtersB, exclude: excludeB, ...otherParamsB } = paramsB
  // Shallow compare them
  if (!shallowEqualObjects(filtersA, filtersB)) {
    return false
  }
  if (!shallowEqualObjects(excludeA, excludeB)) {
    return false
  }
  // Shallow compare extra params
  return shallowEqualObjects(otherParamsA, otherParamsB)
}

export function useMemoCompareWithDeps(objOrDep, compare) {
  const myDeps = [objOrDep]
  const [obj] = getRunValuesFromDeps(myDeps)
  const isNotRunDep = !shouldRunDeps(myDeps)

  const prevRef = useRef(obj)
  const prev = prevRef.current

  const isEqual = isNotRunDep ? false : compare(obj, prev)

  useEffect(() => {
    if (!isEqual && !isNotRunDep) {
      prevRef.current = obj
    }
  })

  if (isNotRunDep) {
    return objOrDep
  }

  return isEqual ? prev : obj
}

export function useMemoCompare(obj, compare) {
  const prevRef = useRef(obj)
  const prev = prevRef.current

  const isEqual = compare(obj, prev)

  useEffect(() => {
    if (!isEqual) {
      prevRef.current = obj
    }
  })

  return isEqual ? prev : obj
}
