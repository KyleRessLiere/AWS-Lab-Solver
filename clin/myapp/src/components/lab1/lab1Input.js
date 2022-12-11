import React from 'react';

export default function Lab1Input() {
  return (
    <><h1>Lab 1 - Introduction to AWS IAM</h1>
    <div>
      <p><em><span>AWS Identity and Access Management (IAM)</span></em>
        <span> is a web service that enables Amazon Web Services (AWS) customers to manage users and user permissions in AWS. With IAM, you can centrally manage </span>
        <em><span>users</span></em><span>, </span><em><span>security credentials</span></em><span> such as access keys, and </span><em><span>permissions</span></em><span> that control which AWS resources users can access. This lab is based on the AWS Command Line Interface (AWS CLI). Feel free to explore the </span><a href='https://docs.aws.amazon.com/cli/latest/reference/iam/index.html'><span>AWS CLI documentation for IAM</span></a><span> as you work through the lab.</span></p>
    
      <h3>Topics Covered</h3>
      <ul><li><span>Explore pre-created </span><em><span>IAM users and groups</span></em></li><li><span>Inspect </span><em><span>IAM policies</span></em><span> that are applied to the pre-created groups</span></li><li><span>Follow a </span><em><span>real-world scenario</span></em><span> by adding users to groups that have specific enabled capabilities </span></li><li><span>Test each user's </span><em><span>permissions</span></em></li><li><em><span>Experiment</span></em><span> with the effects of policies on service access</span></li></ul>
    
    </div></>
  
  );
}