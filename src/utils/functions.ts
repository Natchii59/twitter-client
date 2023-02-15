import moment from 'moment'

export function getRelativeDate(date: Date): string {
  let relative = ''

  if (moment().diff(moment(date), 'minutes') < 1) {
    relative = `${moment().diff(moment(date), 'seconds')}s`
  } else if (moment().diff(moment(date), 'hours') < 1) {
    relative = `${moment().diff(moment(date), 'minutes')}m`
  } else if (moment().diff(moment(date), 'days') < 1) {
    relative = `${moment().diff(moment(date), 'hours')}h`
  } else {
    relative = moment(date).format('DD MMM')
  }

  return relative
}

export function formatNumber(number: number): string {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
  return formatter.format(number)
}
