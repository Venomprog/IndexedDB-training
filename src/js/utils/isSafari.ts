export const isSafariFunction = (): boolean => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}
