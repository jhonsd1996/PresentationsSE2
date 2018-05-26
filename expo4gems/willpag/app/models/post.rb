class Post < ApplicationRecord
    self.per_page = 10
    
    def self.paged(page)
        paged_posts = Post.page(page)
        if paged_posts.current_page > paged_posts.total_pages
            paged_posts = Post.page(paged_posts.total_pages)
        end
        {posts: paged_posts,
         current_page: paged_posts.current_page,
         total_pages: paged_posts.total_pages}
    end
end