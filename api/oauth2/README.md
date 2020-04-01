## [google doc](https://developers.google.com/identity/protocols/oauth2/openid-connect#sendauthrequest)
#### request
1. create 
https://accounts.google.com/signin/oauth/identifier?hd=example.com&client_id=479598600971-8s8mkprq6f4s15qefqiq9nop4rlr5btr.apps.googleusercontent.com&as=yVG7FOtuBnlGTSKlzSgi0A&destination=https%3A%2F%2F7974aff5.ngrok.io&approval_state=!ChRKZ1d1ZEdnbnNDbVVzeF9WMWFRaxIfQTFBYVNSYUpRTkFld0ktM2lWMU9TaWRIRDI5SUV4Yw%E2%88%99AF-3PDcAAAAAXoWMntWx-m7j8Xmfbk6ZHJJeKh4NL_c9&oauthgdpr=1&xsrfsig=ChkAeAh8T6StV27KKuB_3vRSZvHVUq-HxiW5Eg5hcHByb3ZhbF9zdGF0ZRILZGVzdGluYXRpb24SBXNvYWN1Eg9vYXV0aHJpc2t5c2NvcGU&flowName=GeneralOAuthFlow

#### redirect url
https://7974aff5.ngrok.io/?state=security_token=asdfkjasjdfjsd&code=4/yAFkRYlIFEfjBYJaAW9rUqWz3Pp8oYC8-y4ByTM6LLafYmCckNa5kLYjbbauiT7WrGGh2wobEa5OPe3paWz4_ng&scope=email+openid+https://www.googleapis.com/auth/userinfo.email&authuser=2&prompt=consent
1. confirm state `security_token`
2. Exchange code for access token and ID token

https://7974aff5.ngrok.io/?state=
security_token%3Dasdfkjasjdfjsd&
code=4%2FyAHD-a44HK5iN0Bfq8omZEPsnqpLwo5b2TcWLBR0dStlNe_eLlfBNMHF1KSSyyBi7jxR5iyItbJvdKtdOxFDBLY&
scope=email+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=2&
prompt=consent

curl -X POST https://oauth2.googleapis.com/token -H 'Content-Type: application/x-www-form-urlencoded' -d 'code=4/yAFkRYlIFEfjBYJaAW9rUqWz3Pp8oYC8-y4ByTM6LLafYmCckNa5kLYjbbauiT7WrGGh2wobEa5OPe3paWz4_ng&client_id=479598600971-8s8mkprq6f4s15qefqiq9nop4rlr5btr.apps.googleusercontent.com&client_secret=0ZQLUjDK9UmpeoFoCIz6-F5j&redirect_uri=https://7974aff5.ngrok.io&grant_type=authorization_code'

curl -X POST https://oauth2.googleapis.com/token -H 'Content-Type: application/x-www-form-urlencoded' -d 'code=4%2FyAHD-a44HK5iN0Bfq8omZEPsnqpLwo5b2TcWLBR0dStlNe_eLlfBNMHF1KSSyyBi7jxR5iyItbJvdKtdOxFDBLY&client_id=479598600971-8s8mkprq6f4s15qefqiq9nop4rlr5btr.apps.googleusercontent.com&client_secret=0ZQLUjDK9UmpeoFoCIz6-F5j&redirect_uri=https://7974aff5.ngrok.io&grant_type=authorization_code'