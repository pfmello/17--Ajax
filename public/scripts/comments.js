const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form");

function createCommentList(comments) {
  const commentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
    <article class="comment-item">
    <h2>${comment.title}</h2>
    <p>${comment.text}</p>
    </article>
  `;
    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

async function fetchCommentsForPost(event) {
  // const postId = event.target.dataset.postid;
  const postId = loadCommentsBtnElement.dataset.postid;

  try {
    const response = await fetch(`/posts/${postId}/comments`);

    if (!response.ok) {
      alert("fetch falhou !");
      return;
    }

    const parsedResponseData = await response.json();

    if (parsedResponseData && parsedResponseData.length > 0) {
      const commentsListElement = createCommentList(parsedResponseData);
      commentsSectionElement.innerHTML = "";
      commentsSectionElement.appendChild(commentsListElement);
    } else {
      commentsSectionElement.firstElementChild.textContent =
        "Sem comentários... tsc tsc";
    }
  } catch (error) {
    alert("Erro em pegar os comentários !");
  }
}

async function saveComment(event) {
  event.preventDefault();
  const postId = loadCommentsBtnElement.dataset.postid;

  const formData = new FormData(event.target);
  const commentTitle = formData.get("title").trim();
  const commentText = formData.get("text").trim();

  const comment = { title: commentTitle, text: commentText };
  // alert(commentTitle + "  " + commentText + "  " + postId);

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) fetchCommentsForPost();
    else alert("IHH fudeu... cabelo encolheu todinho !");
  } catch (error) {
    alert("Erro no envio da request ! Você está offline");
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment);
