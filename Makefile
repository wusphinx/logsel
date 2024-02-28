.PHONY: chrome
chrome:
	zip -r chrome.zip chrome

.PHONY: firefox
firefox:
	web-ext build --overwrite-dest -s firefox